'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './ProjectAdvisorStepper.module.css';
import { ProjectRecommendation } from './ProjectRecommendation';

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 */
export function ProjectAdvisorStepper({ open, onClose }) {
  const [serviceType, setServiceType] = useState(null); // 'persona' | 'empresa'
  const [steps, setSteps] = useState([]); // { question, options }[]
  const [answers, setAnswers] = useState([]); // string[]
  const [currentAnswer, setCurrentAnswer] = useState(''); // selected answer for current question
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [currentTip, setCurrentTip] = useState(0);
  const [previousRecommendation, setPreviousRecommendation] = useState(null);
  const [showPreviousChoice, setShowPreviousChoice] = useState(false);

  const STORAGE_KEY_PERSONAL = 'project_advisor_recommendation_persona';
  const STORAGE_KEY_CORPORATE = 'project_advisor_recommendation_empresa';
  const MAX_QUESTIONS = 10;

  const loadingTips = useMemo(
    () => [
      {
        icon: 'fa-solid fa-diagram-project',
        text: 'Pensando en la arquitectura que mejor equilibra velocidad, costo y escalabilidad…',
      },
      {
        icon: 'fa-solid fa-layer-group',
        text: 'Evaluando si tu proyecto encaja mejor como landing, web app, app móvil o flujo de automatización…',
      },
      {
        icon: 'fa-solid fa-cloud',
        text: 'Seleccionando stacks modernos como Next.js, Node.js, Flutter o n8n según tus respuestas…',
      },
      {
        icon: 'fa-solid fa-gauge-high',
        text: 'Ajustando el alcance del MVP para que sea realista en tiempo y esfuerzo…',
      },
      {
        icon: 'fa-solid fa-code-branch',
        text: 'Pensando en fases y roadmap para que puedas lanzar rápido y mejorar después…',
      },
    ],
    [],
  );

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setServiceType(null);
      setSteps([]);
      setAnswers([]);
      setCurrentAnswer('');
      setIsLoading(false);
      setRecommendation(null);
      setError(null);
      setShowPreviousChoice(false);
      setPreviousRecommendation(null);
    }
  }, [open]);

  // Rotate tips when loading
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % loadingTips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading, loadingTips.length]);

  // Load previous recommendation when service type is selected
  useEffect(() => {
    if (!serviceType || !open) return;
    const storageKey =
      serviceType === 'empresa' ? STORAGE_KEY_CORPORATE : STORAGE_KEY_PERSONAL;
    const saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (saved) {
      setPreviousRecommendation(saved);
      setShowPreviousChoice(true);
    } else {
      setShowPreviousChoice(false);
    }
  }, [serviceType, open]);

  // Fetch first question when service type is chosen and no steps yet
  useEffect(() => {
    if (!serviceType || !open || steps.length > 0 || recommendation) return;
    fetchNext({ answers: [], serviceType });
  }, [serviceType, open, steps.length, recommendation]);

  const currentStepIndex = steps.length > 0 ? steps.length - 1 : 0;
  const currentQuestion = steps[currentStepIndex] || null;
  const canGoNext = !!currentAnswer && !isLoading;

  const getStepState = (index) => {
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'active';
    return 'inactive';
  };

  const handleOptionSelect = (value, multiple) => {
    setError(null);
    if (!multiple) {
      setCurrentAnswer(value);
      return;
    }
    const parts = currentAnswer ? currentAnswer.split(',').map((p) => p.trim()).filter(Boolean) : [];
    const exists = parts.includes(value);
    const next = exists ? parts.filter((p) => p !== value) : [...parts, value];
    setCurrentAnswer(next.join(', '));
  };

  const isOptionSelected = (value, multiple) => {
    if (!currentAnswer) return false;
    if (multiple) {
      return currentAnswer
        .split(',')
        .map((v) => v.trim())
        .includes(value);
    }
    return currentAnswer === value;
  };

  const handleNext = () => {
    if (!currentQuestion) return;
    if (!currentAnswer || !currentAnswer.trim()) {
      setError('Por favor, selecciona o escribe una respuesta antes de continuar.');
      return;
    }
    const nextAnswers = [...answers, currentAnswer.trim()];
    fetchNext({ answers: nextAnswers, serviceType: serviceType || 'persona' });
  };

  const fetchNext = async ({ answers: nextAnswers, serviceType }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/recommend-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: nextAnswers,
          serviceType,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error al obtener la recomendación.');
      }

      const data = await res.json();

      if (data.type === 'question') {
        const newStep = {
          question: data.question,
          options: data.options || [],
        };
        setSteps((prev) => [...prev, newStep].slice(0, MAX_QUESTIONS));
        setAnswers(nextAnswers);
        setCurrentAnswer('');
        scrollModalToTop();
      } else if (data.type === 'recommendation') {
        const rec = data.recommendation || '';
        setRecommendation(rec);
        setAnswers(nextAnswers);
        const storageKey =
          serviceType === 'empresa' ? STORAGE_KEY_CORPORATE : STORAGE_KEY_PERSONAL;
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, rec);
        }
      } else {
        throw new Error('Respuesta inesperada del servicio de recomendación.');
      }
    } catch (err) {
      console.error('[ProjectAdvisorStepper] Error:', err);
      setError(
        err?.message ||
          'Error al procesar tu solicitud. Por favor, inténtalo de nuevo en unos segundos.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const scrollModalToTop = () => {
    const modal = document.querySelector(`.${styles.modal}`);
    if (modal) {
      modal.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (steps.length <= 1) return;
    const newSteps = steps.slice(0, -1);
    const newAnswers = answers.slice(0, -1);
    setSteps(newSteps);
    setAnswers(newAnswers);
    setCurrentAnswer('');
    setError(null);
    scrollModalToTop();
  };

  const handleReset = () => {
    setSteps([]);
    setAnswers([]);
    setCurrentAnswer('');
    setRecommendation(null);
    setError(null);
    setShowPreviousChoice(false);
    scrollModalToTop();
  };

  const handleClose = () => {
    handleReset();
    setServiceType(null);
    onClose?.();
  };

  const handleViewPrevious = () => {
    if (previousRecommendation) {
      setRecommendation(previousRecommendation);
      setShowPreviousChoice(false);
    }
  };

  const handleStartNew = () => {
    setShowPreviousChoice(false);
    setRecommendation(null);
    setSteps([]);
    setAnswers([]);
    setCurrentAnswer('');
    if (serviceType) {
      fetchNext({ answers: [], serviceType });
    }
  };

  if (!open) return null;

  // Initial service type selector
  if (!serviceType) {
    return (
      <div className={styles.overlay} onClick={handleClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Cerrar"
          >
            <i className="fa-solid fa-times" />
          </button>
          <div className={styles.questionContainer}>
            <div className={styles.questionHeader}>
              <h3 className={styles.question}>¿Para quién es este proyecto de software?</h3>
            </div>
            <div className={styles.optionsContainer}>
              <button
                className={styles.optionButton}
                onClick={() => setServiceType('persona')}
              >
                <div className={styles.optionCheckbox}>
                  <div className={styles.radio}>
                    <div className={styles.radioDot} />
                  </div>
                </div>
                <span className={styles.optionText}>
                  Proyecto para una persona, emprendimiento o pequeño negocio.
                </span>
              </button>
              <button
                className={styles.optionButton}
                onClick={() => setServiceType('empresa')}
              >
                <div className={styles.optionCheckbox}>
                  <div className={styles.radio}>
                    <div className={styles.radioDot} />
                  </div>
                </div>
                <span className={styles.optionText}>
                  Proyecto para empresa / equipo (sistemas internos, integraciones, SaaS, etc.).
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (recommendation) {
    return (
      <div className={styles.overlay} onClick={handleClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Cerrar"
          >
            <i className="fa-solid fa-times" />
          </button>
          <ProjectRecommendation
            recommendation={recommendation}
            onReset={handleReset}
            onClose={handleClose}
          />
        </div>
      </div>
    );
  }

  if (previousRecommendation && showPreviousChoice) {
    return (
      <div className={styles.overlay} onClick={handleClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Cerrar"
          >
            <i className="fa-solid fa-times" />
          </button>
          <div className={styles.previousResultChoice}>
            <div className={styles.choiceHeader}>
              <div className={styles.choiceIcon}>
                <i className="fa-solid fa-clock-rotate-left" />
              </div>
              <h2 className={styles.choiceTitle}>¿Qué quieres hacer?</h2>
              <p className={styles.choiceSubtitle}>
                Ya tienes una recomendación previa para este tipo de proyecto.
              </p>
            </div>
            <div className={styles.choiceActions}>
              <button
                className={styles.viewPreviousButton}
                onClick={handleViewPrevious}
              >
                <i className="fa-solid fa-eye" />
                <span>Ver recomendación anterior</span>
              </button>
              <button
                className={styles.startNewButton}
                onClick={handleStartNew}
              >
                <i className="fa-solid fa-plus" />
                <span>Empezar un análisis nuevo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stepsCount = Math.max(steps.length || 1, 1);
  const progressPct = Math.min(((currentStepIndex + 1) / MAX_QUESTIONS) * 100, 100);

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Cerrar"
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.5 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          <i className="fa-solid fa-times" />
        </button>

        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingContent}>
              <div className={styles.loadingSpinner}>
                <div className={styles.spinnerCircle} />
                <div className={styles.spinnerCircle} />
                <div className={styles.spinnerCircle} />
              </div>
              <p className={styles.loadingText}>
                Analizando tu proyecto para encontrar el stack y enfoque más inteligentes…
              </p>
              <div className={styles.loadingTip}>
                <i
                  className={`${loadingTips[currentTip].icon} ${styles.tipIcon}`}
                />
                <span className={styles.tipText}>
                  {loadingTips[currentTip].text}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.header}>
          <h2 className={styles.title}>
            <i className={`fa-solid fa-code-branch ${styles.titleIcon}`} />
            <span>
              {serviceType === 'empresa'
                ? 'Asistente para Arquitectura de Software Corporativa'
                : 'Asistente para Definir tu Próximo Proyecto Digital'}
            </span>
          </h2>
          <p className={styles.subtitle}>
            Responde estas preguntas y te sugeriremos el tipo de solución, stack y fases ideales
            para tu caso.
          </p>
        </div>

        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className={styles.stepsContainer}>
          <div className={styles.stepsScrollWrapper}>
            <div className={styles.stepsWrapper}>
              {Array.from({ length: stepsCount }).map((_, index) => {
                const state = getStepState(index);
                return (
                  <div key={index} className={styles.stepWrapper}>
                    <div className={styles.stepItem}>
                      <div
                        className={`${styles.stepCircle} ${
                          styles[
                            `stepCircle${
                              state.charAt(0).toUpperCase() + state.slice(1)
                            }`
                          ]
                        }`}
                      >
                        {state === 'completed' ? (
                          <i className="fa-solid fa-check" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                    </div>
                    {index < stepsCount - 1 && (
                      <div
                        className={`${styles.stepLine} ${
                          styles[
                            `stepLine${
                              index < currentStepIndex
                                ? 'Completed'
                                : index === currentStepIndex
                                ? 'Active'
                                : 'Inactive'
                            }`
                          ]
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={styles.questionContainer}
          style={{ display: isLoading ? 'none' : 'block' }}
        >
          <div className={styles.questionHeader}>
            <h3 className={styles.question}>
              {currentQuestion?.question || 'Preparando la siguiente pregunta…'}
            </h3>
          </div>
          <div className={styles.questionInput}>
            {currentQuestion?.options?.length ? (
              <div className={styles.optionsContainer}>
                {currentQuestion.options.map((option) => {
                  const value = option;
                  const multiple = false; // Gemini options are treated as single-choice for simplicity
                  const selected = isOptionSelected(value, multiple);
                  return (
                    <button
                      key={value}
                      className={`${styles.optionButton} ${
                        selected ? styles.optionButtonActive : ''
                      }`}
                      onClick={() => handleOptionSelect(value, multiple)}
                    >
                      <div className={styles.optionCheckbox}>
                        <div
                          className={`${styles.radio} ${
                            selected ? styles.radioChecked : ''
                          }`}
                        >
                          {selected && <div className={styles.radioDot} />}
                        </div>
                      </div>
                      <span className={styles.optionText}>{value}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <textarea
                className={styles.openTextArea}
                placeholder="Escribe tu respuesta con tus propias palabras…"
                value={currentAnswer}
                onChange={(e) => {
                  setCurrentAnswer(e.target.value);
                  setError(null);
                }}
                rows={4}
              />
            )}
          </div>
          {error && (
            <div className={styles.errorMessage}>
              <i className="fa-solid fa-exclamation-circle" />
              {error}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          {steps.length > 1 && (
            <button
              className={styles.backButton}
              onClick={handleBack}
              disabled={isLoading}
            >
              <i className="fa-solid fa-arrow-left" />
              Anterior
            </button>
          )}
          <button
            className={styles.nextButton}
            onClick={handleNext}
            disabled={!canGoNext}
          >
            <span>
              {answers.length + 1 >= MAX_QUESTIONS
                ? 'Pedir recomendación'
                : 'Siguiente'}
            </span>
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
}



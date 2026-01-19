'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './ProjectAdvisorStepper.module.css';
import { ProjectRecommendation } from './ProjectRecommendation';

interface ProjectAdvisorStepperProps {
  open: boolean;
  onClose: () => void;
}

type ServiceType = 'persona' | 'empresa' | null;
type StepState = 'completed' | 'active' | 'inactive';

interface Step {
  question: string;
  options: string[];
}

interface LoadingTip {
  icon: string;
  text: string;
}

export function ProjectAdvisorStepper({ open, onClose }: ProjectAdvisorStepperProps) {
  const [serviceType, setServiceType] = useState<ServiceType>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTip, setCurrentTip] = useState<number>(0);
  const [previousRecommendation, setPreviousRecommendation] = useState<string | null>(null);
  const [showPreviousChoice, setShowPreviousChoice] = useState<boolean>(false);

  const STORAGE_KEY_PERSONAL = 'project_advisor_recommendation_persona';
  const STORAGE_KEY_CORPORATE = 'project_advisor_recommendation_empresa';
  const MAX_QUESTIONS = 10;

  const loadingTips: LoadingTip[] = useMemo(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType, open, steps.length, recommendation]);

  const currentStepIndex = steps.length > 0 ? steps.length - 1 : 0;
  const currentQuestion = steps[currentStepIndex] || null;
  const canGoNext = !!currentAnswer && !isLoading;

  const getStepState = (index: number): StepState => {
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'active';
    return 'inactive';
  };

  const handleOptionSelect = (value: string, multiple: boolean): void => {
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

  const isOptionSelected = (value: string, multiple: boolean): boolean => {
    if (!currentAnswer) return false;
    if (multiple) {
      return currentAnswer
        .split(',')
        .map((v) => v.trim())
        .includes(value);
    }
    return currentAnswer === value;
  };

  const handleNext = (): void => {
    if (!currentQuestion) return;
    if (!currentAnswer || !currentAnswer.trim()) {
      setError('Por favor, selecciona o escribe una respuesta antes de continuar.');
      return;
    }
    const nextAnswers = [...answers, currentAnswer.trim()];
    fetchNext({ answers: nextAnswers, serviceType: serviceType || 'persona' });
  };

  const fetchNext = async ({ answers: nextAnswers, serviceType }: { answers: string[]; serviceType: ServiceType }): Promise<void> => {
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
        throw new Error((data as { error?: string }).error || 'Error al obtener la recomendación.');
      }

      const data = await res.json();

      if (data.type === 'question') {
        const newStep: Step = {
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
        (err as Error)?.message ||
          'Error al procesar tu solicitud. Por favor, inténtalo de nuevo en unos segundos.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const scrollModalToTop = (): void => {
    const modal = document.querySelector(`.${styles.modal}`);
    if (modal) {
      modal.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = (): void => {
    if (steps.length <= 1) return;
    const newSteps = steps.slice(0, -1);
    const newAnswers = answers.slice(0, -1);
    setSteps(newSteps);
    setAnswers(newAnswers);
    setCurrentAnswer('');
    setError(null);
    scrollModalToTop();
  };

  const handleReset = (): void => {
    setSteps([]);
    setAnswers([]);
    setCurrentAnswer('');
    setRecommendation(null);
    setError(null);
    setShowPreviousChoice(false);
    scrollModalToTop();
  };

  const handleClose = (): void => {
    handleReset();
    setServiceType(null);
    onClose?.();
  };

  const handleViewPrevious = (): void => {
    if (previousRecommendation) {
      setRecommendation(previousRecommendation);
      setShowPreviousChoice(false);
    }
  };

  const handleStartNew = (): void => {
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
      <div
        className={styles.overlay}
        onClick={handleClose}
        role="presentation"
      >
        <div
          className={`${styles.modal} ${styles.modalInitial}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="advisor-initial-title"
          aria-describedby="advisor-initial-desc"
        >
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Cerrar"
          >
            <i className="fa-solid fa-times" aria-hidden="true" />
          </button>
          <div className={`${styles.questionContainer} ${styles.questionContainerInitial}`}>
            <div className={styles.serviceTypeHeader}>
              <span className={styles.serviceTypeBadge}>Paso 1</span>
              <div className={styles.serviceTypeIcon}>
                <i className="fa-solid fa-compass" aria-hidden="true" />
              </div>
              <h2 id="advisor-initial-title" className={styles.questionInitial}>
                ¿Para quién es este proyecto de software?
              </h2>
              <p id="advisor-initial-desc" className={styles.serviceTypeSubtitle}>
                Elige el perfil que mejor describe tu caso para personalizar las preguntas.
              </p>
            </div>
            <div className={styles.optionsContainerInitial}>
              <button
                type="button"
                className={`${styles.optionButton} ${styles.optionButtonCard}`}
                onClick={() => setServiceType('persona')}
              >
                <div className={styles.optionIconWrap}>
                  <i className="fa-solid fa-user" aria-hidden="true" />
                </div>
                <div className={styles.optionCardContent}>
                  <span className={styles.optionTitle}>
                    Persona, emprendimiento o pequeño negocio
                  </span>
                  <span className={styles.optionDescription}>
                    Landings, tiendas, portfolios y apps personales.
                  </span>
                </div>
                <i className={`fa-solid fa-chevron-right ${styles.optionChevron}`} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${styles.optionButton} ${styles.optionButtonCard}`}
                onClick={() => setServiceType('empresa')}
              >
                <div className={styles.optionIconWrap}>
                  <i className="fa-solid fa-building" aria-hidden="true" />
                </div>
                <div className={styles.optionCardContent}>
                  <span className={styles.optionTitle}>
                    Empresa o equipo
                  </span>
                  <span className={styles.optionDescription}>
                    Sistemas internos, integraciones, SaaS y productos B2B.
                  </span>
                </div>
                <i className={`fa-solid fa-chevron-right ${styles.optionChevron}`} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (recommendation) {
    return (
      <div className={styles.overlay} onClick={handleClose} role="presentation">
        <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Recomendación de proyecto">
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
      <div className={styles.overlay} onClick={handleClose} role="presentation">
        <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Opciones de recomendación">
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
    <div className={styles.overlay} onClick={handleClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Asistente de proyecto">
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
            <div className={styles.loadingBgOrbs} aria-hidden="true" />
            <div className={styles.loadingContent}>
              <div className={styles.loadingThinking}>
                <div className={styles.thinkingRings}>
                  <div className={styles.thinkingRing} />
                  <div className={styles.thinkingRing} />
                  <div className={styles.thinkingRing} />
                </div>
                <div className={styles.thinkingIcon}>
                  <i className="fa-solid fa-wand-magic-sparkles" />
                </div>
              </div>
              <h3 className={styles.loadingTitle}>
                Analizando tu proyecto
              </h3>
              <p className={styles.loadingText}>
                Buscando el stack y enfoque más inteligentes para tu caso…
              </p>
              <div className={styles.loadingProgress}>
                <div className={styles.loadingProgressBar} />
              </div>
              <p className={styles.loadingHint}>
                Suele tardar entre 10 y 30 segundos
              </p>
              <div className={styles.loadingTip}>
                <div className={styles.loadingTipSteps}>
                  {loadingTips.map((_, i) => (
                    <span
                      key={i}
                      className={`${styles.loadingTipStep} ${i === currentTip ? styles.loadingTipStepActive : ''}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className={styles.loadingTipContent}>
                  <i
                    className={`${loadingTips[currentTip].icon} ${styles.tipIcon}`}
                    aria-hidden="true"
                  />
                  <span className={styles.tipText}>
                    {loadingTips[currentTip].text}
                  </span>
                </div>
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
                  const multiple = false; // For ahora tratamos todas como single-choice
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
            ) : currentQuestion ? (
              <div className={styles.errorMessage}>
                <i className="fa-solid fa-exclamation-triangle" />
                No se pudieron cargar opciones para esta pregunta. Intenta de nuevo o cierra el
                asistente e inténtalo más tarde.
              </div>
            ) : null}
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


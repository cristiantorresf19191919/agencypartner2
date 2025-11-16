'use client';

import { useMemo } from 'react';
import styles from './ProjectRecommendation.module.css';

/**
 * Props:
 * - recommendation: string
 * - onReset: () => void
 * - onClose: () => void
 */
export function ProjectRecommendation({ recommendation, onReset, onClose }) {
  const parsed = useMemo(() => parseRecommendation(recommendation), [recommendation]);

  return (
    <div className={styles.recommendationContainer}>
      <div className={styles.recommendationHeader}>
        <div className={styles.recommendationIcon}>
          <i className="fa-solid fa-microchip" />
        </div>
        <h2 className={styles.recommendationTitle}>Recomendación de Arquitectura</h2>
        <p className={styles.recommendationSubtitle}>
          Esta es una propuesta de tipo de solución, tecnologías y fases para tu proyecto
          basada en tus respuestas.
        </p>
      </div>

      <div className={styles.recommendationContent}>
        <div className={styles.mainRecommendationCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <i className="fa-solid fa-star" />
            </div>
            <div className={styles.cardHeaderText}>
              <span className={styles.cardLabel}>Recomendación principal</span>
              <span className={styles.badge}>
                <span className={styles.badgeDot} />
                Basada en flujo dinámico de 5–10 preguntas
              </span>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.fieldColumn}>
              {parsed.solutionType && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Tipo de solución propuesta</span>
                  <span className={styles.fieldValueStrong}>
                    {parsed.solutionType}
                  </span>
                </div>
              )}

              {parsed.scope && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Alcance aproximado (MVP)</span>
                  <span className={styles.fieldValue}>{parsed.scope}</span>
                </div>
              )}

              {parsed.phases && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Fases sugeridas</span>
                  <span className={styles.fieldValue}>{parsed.phases}</span>
                </div>
              )}
            </div>

            <div className={styles.fieldColumn}>
              {parsed.technologies && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Tecnologías principales</span>
                  <div className={styles.pillRow}>
                    {parsed.technologiesPills.map((t) => (
                      <span key={t} className={styles.pill}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.field}>
                {parsed.time && (
                  <>
                    <span className={styles.fieldLabel}>Estimación de tiempo</span>
                    <span className={styles.fieldValue}>{parsed.time}</span>
                  </>
                )}
                {parsed.complexity && (
                  <>
                    <span className={styles.fieldLabel}>Nivel de complejidad</span>
                    <span className={styles.tag}>{parsed.complexity}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {parsed.reason && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <i className="fa-solid fa-lightbulb" />
                <span className={styles.sectionTitle}>Por qué esta recomendación</span>
              </div>
              <p className={styles.sectionBody}>{parsed.reason}</p>
            </div>
          )}

          {parsed.alternatives.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <i className="fa-solid fa-shuffle" />
                <span className={styles.sectionTitle}>Alternativas sugeridas</span>
              </div>
              <ul className={styles.list}>
                {parsed.alternatives.map((alt, index) => (
                  <li key={index} className={styles.listItem}>
                    {alt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {parsed.risks && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <i className="fa-solid fa-triangle-exclamation" />
                <span className={styles.sectionTitle}>Riesgos / dependencias clave</span>
              </div>
              <p className={styles.sectionBody}>{parsed.risks}</p>
            </div>
          )}

          {parsed.notes && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <i className="fa-solid fa-note-sticky" />
                <span className={styles.sectionTitle}>Notas adicionales</span>
              </div>
              <p className={styles.sectionBody}>{parsed.notes}</p>
            </div>
          )}

          {parsed.raw && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <i className="fa-solid fa-align-left" />
                <span className={styles.sectionTitle}>Detalle completo</span>
              </div>
              <p className={styles.sectionBody} style={{ whiteSpace: 'pre-line' }}>
                {parsed.raw}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.recommendationActions}>
        <button className={styles.resetButton} onClick={onReset}>
          <i className="fa-solid fa-rotate-left" />
          Volver a empezar
        </button>
        <button className={styles.closeRecButton} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

function parseRecommendation(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  const getValueAfterLabel = (labelVariants) => {
    for (const line of lines) {
      for (const label of labelVariants) {
        if (line.toLowerCase().startsWith(label.toLowerCase())) {
          return line.split(':').slice(1).join(':').trim();
        }
      }
    }
    return '';
  };

  const solutionType = getValueAfterLabel([
    'Tipo de solución propuesta:',
    'Tipo de solución recomendada:',
  ]);

  const technologies = getValueAfterLabel([
    'Tecnologías principales:',
    'Arquitectura y tecnologías principales:',
  ]);

  const scope = getValueAfterLabel([
    'Alcance aproximado (MVP):',
    'Alcance aproximado del MVP:',
  ]);

  const time = getValueAfterLabel([
    'Estimación de tiempo:',
    'Fases y estimación de tiempo:',
  ]);

  const complexity = getValueAfterLabel(['Nivel de complejidad:']);

  const phases = getValueAfterLabel(['Fases sugeridas:']);

  const reasons = getValueAfterLabel(['Razones de la recomendación:']);

  const alternativesBlock = getValueAfterLabel(['Alternativas recomendadas:', 'Alternativas sugeridas:']);

  const risks = getValueAfterLabel(['Riesgos o dependencias clave:']);

  const notes = getValueAfterLabel(['Notas importantes:', 'Notas adicionales:']);

  const technologiesPills =
    technologies
      ?.split(/[,\u2022\-]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0) || [];

  const alternatives = [];
  if (alternativesBlock) {
    alternatives.push(
      ...alternativesBlock
        .split(/[•\-]/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    );
  }

  return {
    solutionType,
    technologies,
    technologiesPills,
    scope,
    time,
    complexity,
    phases,
    reason: reasons,
    alternatives,
    risks,
    notes,
    raw: text,
  };
}



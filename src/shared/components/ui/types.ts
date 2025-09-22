/**
 * Loading spinner component props
 */
export interface LoadingSpinnerProps {
  readonly size?: 'small' | 'medium' | 'large';
  readonly color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  readonly className?: string;
}
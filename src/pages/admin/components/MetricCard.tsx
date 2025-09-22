import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

/**
 * Metric card props
 */
interface MetricCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly subtitle?: string;
  readonly icon?: React.ReactNode;
  readonly color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  readonly trend?: {
    value: number;
    isPositive: boolean;
  };
}

/**
 * Metric card component for displaying key performance indicators
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  trend,
}) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </div>
          
          {icon && (
            <Box 
              sx={{ 
                color: `${color}.main`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: `${color}.50`,
              }}
            >
              {icon}
            </Box>
          )}
        </div>

        {trend && (
          <div className="flex items-center">
            <Typography
              variant="body2"
              sx={{
                color: trend.isPositive ? 'success.main' : 'error.main',
                fontWeight: 'medium',
              }}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Typography>
            <Typography variant="body2" color="textSecondary" className="ml-1">
              from last month
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
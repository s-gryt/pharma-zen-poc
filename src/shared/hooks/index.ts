/**
 * Shared hooks entry point
 * 
 * Exports all reusable hooks for use across the application.
 * 
 * @fileoverview Shared hooks public interface
 */

export { useApi, useMutation } from './useApi';
export { useLocalStorage, useSessionStorage } from './useLocalStorage';
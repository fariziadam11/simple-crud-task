import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  return (
    <motion.div 
      className="p-3 sm:p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center mb-3">
        <div className="mr-3 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">{title}</h3>
      </div>
      
      <div className="mt-2 pl-13">
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      </div>
      
      <div className="mt-5 sm:mt-4 flex flex-col-reverse sm:flex-row-reverse gap-2 sm:gap-3">
        <Button
          variant="danger"
          onClick={onConfirm}
          isLoading={isLoading}
          className="w-full sm:w-auto"
        >
          {confirmLabel}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {cancelLabel}
        </Button>
      </div>
    </motion.div>
  );
};
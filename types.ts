import React from 'react';

export enum ModCategory {
  WHEELS = 'Velg & Ban',
  PAINT = 'Cat & Warna',
  BODY_KIT = 'Body Kit & Paint',
  FRONT = 'Bagian Depan',
  SIDE = 'Bagian Samping',
  REAR = 'Bagian Belakang',
  ROOF = 'Atap & Rak',
  LIGHTS = 'Lampu & Sign'
}

export interface ModificationOption {
  id: string;
  name: string;
  category: ModCategory;
  promptDescription: string; // The instruction sent to AI
  icon?: React.ReactNode;
  requiresInput?: boolean; // If true, prompts user for text input
}

export interface SelectedModification extends ModificationOption {
  customInput?: string;
}

export interface AppState {
  originalImage: string | null; // Primary image for reset
  referenceImages: string[]; // Additional images for context
  currentImage: string | null;
  isLoading: boolean;
  history: string[];
  historyIndex: number;
  error: string | null;
  is360Mode: boolean;
  frames360: string[]; // Array of base64 images for the rotation
  installedParts: SelectedModification[]; // Track applied modifications (history)
  pendingMods: SelectedModification[]; // Track mods waiting to be processed
}
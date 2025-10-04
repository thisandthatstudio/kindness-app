import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRESET_ACTS } from '../lib/presets/kindness';

type CustomPreset = {
  id: string;
  label: string;
  isHidden?: boolean;
};

type SettingsState = {
  customPresets: CustomPreset[];
  hiddenPresetIds: string[];
  notificationEnabled: boolean;
  notificationTime: string;
  isDonor: boolean;
  
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  addCustomPreset: (label: string) => void;
  removeCustomPreset: (id: string) => void;
  togglePresetVisibility: (id: string) => void;
  setNotificationEnabled: (enabled: boolean) => void;
  setNotificationTime: (time: string) => void;
  setDonor: (isDonor: boolean) => void;
};

const useSettingsStore = create<SettingsState>((set, get) => ({
  customPresets: [],
  hiddenPresetIds: [],
  notificationEnabled: false,
  notificationTime: '20:00',
  isDonor: false,

  loadSettings: async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        set(parsed);
      }
    } catch (error) {
      console.error('설정 로드 실패:', error);
    }
  },

  saveSettings: async () => {
    try {
      const state = get();
      const toSave = {
        customPresets: state.customPresets,
        hiddenPresetIds: state.hiddenPresetIds,
        notificationEnabled: state.notificationEnabled,
        notificationTime: state.notificationTime,
        isDonor: state.isDonor,
      };
      await AsyncStorage.setItem('appSettings', JSON.stringify(toSave));
    } catch (error) {
      console.error('설정 저장 실패:', error);
    }
  },

  addCustomPreset: (label: string) => {
    const id = `custom_${Date.now()}`;
    set(state => ({
      customPresets: [...state.customPresets, { id, label }]
    }));
    get().saveSettings();
  },

  removeCustomPreset: (id: string) => {
    set(state => ({
      customPresets: state.customPresets.filter(p => p.id !== id)
    }));
    get().saveSettings();
  },

  togglePresetVisibility: (id: string) => {
    set(state => ({
      hiddenPresetIds: state.hiddenPresetIds.includes(id)
        ? state.hiddenPresetIds.filter(pid => pid !== id)
        : [...state.hiddenPresetIds, id]
    }));
    get().saveSettings();
  },

  setNotificationEnabled: (enabled: boolean) => {
    set({ notificationEnabled: enabled });
    get().saveSettings();
  },

  setNotificationTime: (time: string) => {
    set({ notificationTime: time });
    get().saveSettings();
  },

  setDonor: (isDonor: boolean) => {
    set({ isDonor });
    get().saveSettings();
  },
}));

export default useSettingsStore;
import { createContext } from 'react';
import rootStore, { RootStore } from '../stores/root.store';

export const StoreContext = createContext<RootStore>(rootStore);

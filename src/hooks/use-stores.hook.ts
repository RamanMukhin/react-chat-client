import { useContext } from 'react';
import { RootStore } from '../stores/root.store';
import { StoreContext } from '../context/store.context';

export const useStores = (): RootStore => useContext(StoreContext);

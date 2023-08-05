import { MutableRefObject } from 'react';

export enum TimeDelayTypesEnum {
  throttle = 'throttle',
  debounce = 'debounce',
}

export class UtilsService {
  /**
   * @param ms - throttle or debounce time in miliseconds
   * @param lastSubmit - useRef object of the last submit time
   * @param mode - throttle or debounce, default - throttle
   */
  public canInvoke(
    ms: number,
    lastSubmit: MutableRefObject<null | number>,
    mode: TimeDelayTypesEnum = TimeDelayTypesEnum.throttle,
  ): boolean {
    const allowed = !lastSubmit.current || Date.now() - lastSubmit.current > ms;

    if (allowed) {
      lastSubmit.current = Date.now();

      return allowed;
    }

    if (mode === 'debounce') {
      lastSubmit.current = Date.now();
    }

    return allowed;
  }
}

export const utilsService = new UtilsService();

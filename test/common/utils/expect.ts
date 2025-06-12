import { expect } from 'vitest';
import { Base } from '~test/common/data/base';

/** Expect Service Utils. */
export const expectService = {
  /**
   * Same instance.
   *
   * @param service1 Service 1.
   * @param service2 Service 2.
   */
  same: (service1: Base, service2: Base): void => {
    expect(service1).toBeInstanceOf(Base);
    expect(service2).toBeInstanceOf(Base);

    expect(service1).toBe(service2);
    expect(service1.id).toBe(service2.id);
  },

  /**
   * Not same instance.
   *
   * @param service1 Service 1.
   * @param service2 Service 2.
   */
  not: {
    same: (service1: Base, service2: Base): void => {
      expect(service1).toBeInstanceOf(Base);
      expect(service2).toBeInstanceOf(Base);

      expect(service1).not.toBe(service2);
      expect(service1.id).not.toBe(service2.id);
    },
  },
};

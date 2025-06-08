/* eslint-disable no-use-before-define */

export namespace DODPrivateFixtures {
  export type PhoneAttrs = {
    number: string,
    type: string, // 'mobile' | 'work'
    noOutField: string,
  };

  export const phoneAttrs: PhoneAttrs = {
    number: '+7-777-287-81-82',
    type: 'mobile',
    noOutField: 'empty info',
  };

  export type EmailAttrs = {
    value: string,
    noOutField: string,
  };

  export const emailAttrs: EmailAttrs = {
    value: 'email@example.com',
    noOutField: 'empty info',
  };

  export type PersonContactsAttrs = {
    phones: PhoneAttrs[],
    email: EmailAttrs,
    address: string,
    noOutField: string,
  };

  export const personContactAttrs: PersonContactsAttrs = {
    phones: [phoneAttrs],
    email: emailAttrs,
    address: 'Kazakhstan, Uralsk, 27 Kurmangazy street',
    noOutField: 'he-he-he',
  };

  export type PersonAttrs = {
    id: string,
    name: string,
    lastName: string,
    birthday: number,
    age: number,
    contacts: PersonContactsAttrs,
  };

  export const personAttrs: PersonAttrs = {
    id: '1',
    name: 'Nur',
    lastName: 'Ama',
    birthday: new Date('1979-01-17').getTime(),
    age: 42,
    contacts: personContactAttrs,
  };

  export const personAddPhoneEvent = {
    name: 'PersonPhoneAddedEvent',
    description: 'Выпускается когда человек добавляет телефон',
    attrs: phoneAttrs,
  };

  export type PersonAddPhoneEvent = typeof personAddPhoneEvent;

  export const personEmailAddEvent = {
    name: 'PersonEmailAddEvent',
    description: 'Выпускается когда человек добавляет емайл',
    attrs: phoneAttrs,
  };

  export type PersonEmailAddEvent = typeof personEmailAddEvent;

  export const internalServerError = {
    name: 'Internal server error',
    description: 'Произошла неожиданная ошибка в сервере',
    type: 'app-error',
  };

  export type InternalServerError = typeof internalServerError;

  export const personNotExistError = {
    name: 'Person not exist error',
    description: 'Произошла неожиданная ошибка в сервере',
    type: 'app-error',
  };

  export type PersonNotExitsError = typeof personNotExistError;

  export type PersonMeta = {
    name: 'PersonAR',
    title: 'Агрегат персоны',
    description: 'Представляет в системе отдельного человека',
    attrs: PersonAttrs,
    events: [PersonAddPhoneEvent, PersonEmailAddEvent],
  }
}

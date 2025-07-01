export type OwnerAggregateAttrs = {
  ownerId: string; // id агрегата владельца
  ownerName: string; // имя агрегата владельца
  context: string; // используемый контекст данного агрегата, например: аватар, слайдер
  access: string; // доступ
}

/**
 * Базовые атрибуты для абстрактных агрегатов, содержащие информацию о владельце.
 */
export type AbstractAggregateAttrs = OwnerAggregateAttrs & {
  id: string; // id абстрактного агрегата
}

export type NotContentToDeliveryError = {
  name: 'NotContentToDeliveryError',
  description?: string,
  type: 'domain-error'
}

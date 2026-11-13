export type CategoryIconKey =
  | 'motors'
  | 'bearings'
  | 'transformers'
  | 'valves'
  | 'pipes'
  | 'cables'
  | 'fasteners'
  | 'cylinders'
  | 'generic';

export interface CategoryItem {
  id: string;
  code: string;
  title: string;
  icon: CategoryIconKey;
  placeholder: string;
}

export interface SelectedPosition {
  categoryId: string;
  note: string;
}

export interface SellerMemoItem {
  id: string;
  step: string;
  title: string;
  description: string;
}

export interface GuaranteeCardItem {
  id: string;
  title: string;
  subtitle: string;
}

export interface SiteConfig {
  phoneDisplay: string;
  phoneTel: string;
  telegramUrl: string;
  whatsappUrl: string;
  schedule: string;
  heroTitle: string;
  guaranteeText: string;
  politeClosing: string;
  guarantees: GuaranteeCardItem[];
  sellerMemo: SellerMemoItem[];
  quickChips: string[];
  modalConditionChips: string[];
  categories: CategoryItem[];
}

export const SITE_CONFIG: SiteConfig = {
  phoneDisplay: '8 (981) 038-89-03',
  phoneTel: 'tel:+79810388903',
  telegramUrl: 'https://t.me/+79810388903',
  whatsappUrl: 'https://wa.me/79810388903',
  schedule: '',
  heroTitle:
    'Покупаем неликвиды, складские остатки и б/у промышленное оборудование',
  guaranteeText:
    'Организация погрузки и транспортировки, оперативная оценка перечней',
  politeClosing: 'Заранее благодарим за скорое рассмотрение нашего запроса.',
  guarantees: [
    {
      id: 'logistics',
      title: 'Организация погрузки и транспортировки',
      subtitle:
        'Организацию погрузки и транспортировки оборудования и материалов со склада берем на себя.',
    },
    {
      id: 'evaluation',
      title: 'Оперативная оценка перечней и фото',
      subtitle:
        'Быстро рассматриваем ведомости остатков, маркировки с бирок и обзорные фотографии позиций.',
    },
  ],
  sellerMemo: [
    {
      id: 'memo-1',
      step: '01',
      title: 'Наименование или фото бирки',
      description:
        'Достаточно общего перечня позиций, маркировки с шильдика или обзорных фотографий в мессенджере.',
    },
    {
      id: 'memo-2',
      step: '02',
      title: 'Примерное количество',
      description:
        'Укажите ориентировочный объём: штуки, тонны, бухты, барабаны, ящики или общая партия.',
    },
    {
      id: 'memo-3',
      step: '03',
      title: 'Состояние (с хранения или б/у)',
      description:
        'Отметьте статус остатков: складское хранение, неликвид или бывшее в употреблении оборудование.',
    },
  ],
  quickChips: [
    '+ Есть фотографии',
    '+ Есть ведомость остатков',
    '+ Складское хранение',
    '+ Б/У',
  ],
  modalConditionChips: [
    'Складское хранение',
    'Б/У',
    'Неликвид',
    'В упаковке',
    'Партия',
  ],
  categories: [
    {
      id: '01',
      code: 'КАТ. 01',
      title: 'Электродвигатели, радиоприборы, пускатели',
      icon: 'motors',
      placeholder: 'Например: 12 шт. или 1 партия',
    },
    {
      id: '02',
      code: 'КАТ. 02',
      title: 'Подшипники, редукторы',
      icon: 'bearings',
      placeholder: 'Например: 40 шт. или партия со склада',
    },
    {
      id: '03',
      code: 'КАТ. 03',
      title: 'Трансформаторы масляные и сухозаряженные',
      icon: 'transformers',
      placeholder: 'Например: 2 шт., с хранения',
    },
    {
      id: '04',
      code: 'КАТ. 04',
      title: 'Запорная арматура',
      icon: 'valves',
      placeholder: 'Например: 15 шт., партия',
    },
    {
      id: '05',
      code: 'КАТ. 05',
      title: 'Трубы стальные, нержавейка',
      icon: 'pipes',
      placeholder: 'Например: ~5 тонн, разные диаметры',
    },
    {
      id: '06',
      code: 'КАТ. 06',
      title: 'Кабельная продукция',
      icon: 'cables',
      placeholder: 'Например: 3 барабана / 5 бухт',
    },
    {
      id: '07',
      code: 'КАТ. 07',
      title: 'Метизы',
      icon: 'fasteners',
      placeholder: 'Например: ~300 кг / 10 ящиков',
    },
    {
      id: '08',
      code: 'КАТ. 08',
      title: 'Баллоны кислородные, углекислотные, аргон',
      icon: 'cylinders',
      placeholder: 'Например: 20 шт., партия',
    },
  ],
};

export function deriveContactLinks(phoneDisplay: string): {
  phoneTel: string;
  telegramUrl: string;
  whatsappUrl: string;
} {
  const digits = phoneDisplay.replace(/\D/g, '');
  let normalized = digits;

  if (digits.length === 11 && digits.startsWith('8')) {
    normalized = `7${digits.slice(1)}`;
  } else if (digits.length === 10) {
    normalized = `7${digits}`;
  } else if (digits.length === 0) {
    normalized = '79810388903';
  }

  return {
    phoneTel: `tel:+${normalized}`,
    telegramUrl: `https://t.me/+${normalized}`,
    whatsappUrl: `https://wa.me/${normalized}`,
  };
}

const SERIALIZER_TEMPLATE: readonly string[] = [
  "export type CategoryIconKey =",
  "  | 'motors'",
  "  | 'bearings'",
  "  | 'transformers'",
  "  | 'valves'",
  "  | 'pipes'",
  "  | 'cables'",
  "  | 'fasteners'",
  "  | 'cylinders'",
  "  | 'generic';",
  "",
  "export interface CategoryItem {",
  "  id: string;",
  "  code: string;",
  "  title: string;",
  "  icon: CategoryIconKey;",
  "  placeholder: string;",
  "}",
  "",
  "export interface SelectedPosition {",
  "  categoryId: string;",
  "  note: string;",
  "}",
  "",
  "export interface SellerMemoItem {",
  "  id: string;",
  "  step: string;",
  "  title: string;",
  "  description: string;",
  "}",
  "",
  "export interface GuaranteeCardItem {",
  "  id: string;",
  "  title: string;",
  "  subtitle: string;",
  "}",
  "",
  "export interface SiteConfig {",
  "  phoneDisplay: string;",
  "  phoneTel: string;",
  "  telegramUrl: string;",
  "  whatsappUrl: string;",
  "  schedule: string;",
  "  heroTitle: string;",
  "  guaranteeText: string;",
  "  politeClosing: string;",
  "  guarantees: GuaranteeCardItem[];",
  "  sellerMemo: SellerMemoItem[];",
  "  quickChips: string[];",
  "  modalConditionChips: string[];",
  "  categories: CategoryItem[];",
  "}",
  "",
  "export const SITE_CONFIG: SiteConfig = __SITE_CONFIG_TOKEN__;",
  "",
  "export function deriveContactLinks(phoneDisplay: string): {",
  "  phoneTel: string;",
  "  telegramUrl: string;",
  "  whatsappUrl: string;",
  "} {",
  "  const digits = phoneDisplay.replace(/\\D/g, '');",
  "  let normalized = digits;",
  "",
  "  if (digits.length === 11 && digits.startsWith('8')) {",
  "    normalized = `7${digits.slice(1)}`;",
  "  } else if (digits.length === 10) {",
  "    normalized = `7${digits}`;",
  "  } else if (digits.length === 0) {",
  "    normalized = '79810388903';",
  "  }",
  "",
  "  return {",
  "    phoneTel: `tel:+${normalized}`,",
  "    telegramUrl: `https://t.me/+${normalized}`,",
  "    whatsappUrl: `https://wa.me/${normalized}`,",
  "  };",
  "}",
  "",
  "const SERIALIZER_TEMPLATE: readonly string[] = __SERIALIZER_TEMPLATE_TOKEN__;",
  "",
  "export function serializeSiteConfigToTs(config: SiteConfig): string {",
  "  const configJson = JSON.stringify(config, null, 2);",
  "  const templateJson = JSON.stringify(SERIALIZER_TEMPLATE, null, 2);",
  "  return SERIALIZER_TEMPLATE.join('\\n')",
  "    .replace('__SERIALIZER_TEMPLATE_TOKEN__', () => templateJson)",
  "    .replace('__SITE_CONFIG_TOKEN__', () => configJson);",
  "}",
  "",
];

export function serializeSiteConfigToTs(config: SiteConfig): string {
  const configJson = JSON.stringify(config, null, 2);
  const templateJson = JSON.stringify(SERIALIZER_TEMPLATE, null, 2);
  return SERIALIZER_TEMPLATE.join('\n')
    .replace('__SERIALIZER_TEMPLATE_TOKEN__', () => templateJson)
    .replace('__SITE_CONFIG_TOKEN__', () => configJson);
}

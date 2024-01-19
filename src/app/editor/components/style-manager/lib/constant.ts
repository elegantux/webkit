import {
  FaArrowDown as ArrowDownIcon,
  FaArrowLeft as ArrowLeftIcon,
  FaArrowRight as ArrowRightIcon,
  FaArrowUp as ArrowUpIcon,
  FaArrowsUpDown as ArrowsUpDownIcon,
  FaA as AutoIcon,
  FaBan as BanIcon,
  FaEyeSlash as HiddenIcon,
  FaArrowsLeftRight as HorizontalArrowsLeftRight,
  FaArrowsLeftRightToLine as HorizontalStretchIcon,
  FaMinus as MinusIcon,
  FaArrowsUpDownLeftRight as ScrollIcon,
  FaEye as VisibleIcon,
} from 'react-icons/fa6';
import {
  BsAlignBottom as FlexAlignBottom,
  BsAlignCenter as FlexAlignCenter,
  BsAlignEnd as FlexAlignEnd,
  BsAlignMiddle as FlexAlignMiddle,
  BsAlignStart as FlexAlignStart,
  BsAlignTop as FlexAlignTop,
} from 'react-icons/bs';

export const UNIT_TYPES: Record<string, string> = {
  PX: 'px',
  PERCENT: '%',
  REM: 'rem',
  EM: 'em',
  VH: 'vh',
  VW: 'vw',
  DEG: 'deg',
};

export const UNITS: string[] = [
  UNIT_TYPES.PX,
  UNIT_TYPES.PERCENT,
  UNIT_TYPES.REM,
  UNIT_TYPES.EM,
  UNIT_TYPES.VH,
  UNIT_TYPES.VW,
  UNIT_TYPES.DEG,
];

export const WIDTH_UNITS = {
  [UNIT_TYPES.PX]: UNIT_TYPES.PX,
  [UNIT_TYPES.VW]: UNIT_TYPES.VW,
  [UNIT_TYPES.PERCENT]: UNIT_TYPES.PERCENT,
};

export const HEIGHT_UNITS = {
  [UNIT_TYPES.PX]: UNIT_TYPES.PX,
  [UNIT_TYPES.VH]: UNIT_TYPES.VH,
  [UNIT_TYPES.PERCENT]: UNIT_TYPES.PERCENT,
};

export const STYLE_TYPES = {
  // New types
  NUMBER: 'number',
  FLOAT: 'float',
  INPUT: 'input',
  SELECT: 'select',
  RADIO: 'radio',
  COLOR: 'color',
  COMPOSITION: 'composition',
};

export const STYLE_MANAGER_SECTION_NAME = {
  BACKGROUND: 'Background',
  DISPLAY: 'Display',
  TYPOGRAPHY: 'Typography',
  DECORATIONS: 'Decorations',
  EXTRA: 'Extra',
  POSITION: 'Position',
  SIZING: 'Sizing',
  SPACING: 'Spacing',
  BORDER: 'Border',
  BOX_SHADOW: 'Box Shadow',
  TRANSFORM: 'Transform',
  ANIMATION: 'Animation',
};

export const displaySector = {
  name: STYLE_MANAGER_SECTION_NAME.DISPLAY,
  open: true,
  properties: [
    {
      label: 'Display',
      property: 'display',
      default: '',
      type: STYLE_TYPES.SELECT,
      colSpan: 2,
      options: [
        { label: 'Flex', value: 'flex' },
        { label: 'Grid', value: 'grid' },
        { label: 'Block', value: 'block' },
        { label: 'Inline', value: 'inline' },
        { label: 'Inline Flex', value: 'inline-flex' },
        { label: 'Inline Block', value: 'inline-block' },
        { label: 'None', value: 'none' },
      ],
    },
    {
      type: STYLE_TYPES.RADIO,
      label: 'Overflow',
      property: 'overflow',
      default: '',
      colSpan: 2,
      options: [
        { label: 'visible', value: 'visible', icon: VisibleIcon },
        { label: 'hidden', value: 'hidden', icon: HiddenIcon },
        { label: 'scroll', value: 'scroll', icon: ScrollIcon },
        { label: 'auto', value: 'auto', icon: AutoIcon },
      ],
    },
    {
      label: 'Justify Content',
      property: 'justify-content',
      type: STYLE_TYPES.RADIO,
      default: 'none',
      colSpan: 2,
      options: [
        { value: 'flex-start', label: 'Flex Start', icon: FlexAlignStart },
        { value: 'center', label: 'Center', icon: FlexAlignCenter },
        { value: 'flex-end', label: 'Flex End', icon: FlexAlignEnd },
        { value: 'space-around', label: 'Space Around', icon: HorizontalStretchIcon },
        { value: 'space-between', label: 'Space Between', icon: HorizontalArrowsLeftRight },
        // { value: 'space-evenly', label: 'Space Evenly' },
      ],
    },
    {
      label: 'Align Items',
      property: 'align-items',
      type: STYLE_TYPES.RADIO,
      default: 'none',
      colSpan: 2,
      options: [
        { value: 'center', label: 'Center', icon: FlexAlignMiddle },
        { value: 'flex-start', label: 'Flex Start', icon: FlexAlignTop },
        { value: 'flex-end', label: 'Flex End', icon: FlexAlignBottom },
        { value: 'stretch', label: 'Stretch', icon: ArrowsUpDownIcon },
        { value: 'baseline', label: 'Base Line', icon: MinusIcon },
      ],
    },
    {
      label: 'Flex Direction',
      property: 'flex-direction',
      type: STYLE_TYPES.RADIO,
      default: 'none',
      colSpan: 2,
      options: [
        { value: 'column', label: 'Column', icon: ArrowDownIcon },
        { value: 'column-reverse', label: 'Column Reverse', icon: ArrowUpIcon },
        { value: 'row', label: 'Row', icon: ArrowRightIcon },
        { value: 'row-reverse', label: 'Row Reverse', icon: ArrowLeftIcon },
      ],
    },
    {
      label: 'Flex Wrap',
      property: 'flex-wrap',
      type: STYLE_TYPES.RADIO,
      default: 'none',
      options: [
        { value: 'nowrap', label: 'No Wrap', icon: BanIcon },
        { value: 'wrap', label: 'Wrap', icon: ArrowDownIcon },
        { value: 'wrap-reverse', label: 'Wrap Reverse', icon: ArrowUpIcon },
      ],
    },
    {
      label: 'Gap',
      property: 'gap',
      type: STYLE_TYPES.INPUT,
      default: '0',
      units: ['px', 'vw'],
      min: 0,
    },
    {
      label: 'Flex',
      property: 'flex',
      type: STYLE_TYPES.NUMBER,
      default: '',
      min: 0,
    },
    {
      label: 'Grid Columns',
      property: 'grid-template-columns',
      type: STYLE_TYPES.INPUT,
      default: '',
    },
    {
      label: 'Grid Rows',
      property: 'grid-template-rows',
      type: STYLE_TYPES.INPUT,
      default: '',
    },
  ],
};

export const typographySector = {
  name: STYLE_MANAGER_SECTION_NAME.TYPOGRAPHY,
  open: false,
  properties: [
    {
      type: STYLE_TYPES.INPUT,
      label: 'Font Size',
      property: 'font-size',
      default: '16',
      units: ['px', 'rem'],
      min: 0,
    },
    {
      type: STYLE_TYPES.COLOR,
      label: 'Color',
      property: 'color',
    },
    {
      type: STYLE_TYPES.SELECT,
      label: 'Font Family',
      property: 'font-family',
      default: '',
      // options: fontFamilyNames.map(font => ({ label: font, value: font }))
    },
    {
      // Default options
      type: STYLE_TYPES.SELECT,
      label: 'Text Align',
      property: 'text-align',
      default: '',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Right',
          value: 'right',
        },
        {
          label: 'Justify',
          value: 'justify',
        },
      ],
    },
    {
      type: STYLE_TYPES.RADIO,
      label: 'Overflow',
      property: 'text-overflow',
      default: '',
      options: [
        { label: 'Clip', value: 'clip' },
        { label: 'Ellipsis', value: 'ellipsis' },
      ],
    },
    {
      type: STYLE_TYPES.SELECT,
      label: 'Transform',
      property: 'text-transform',
      default: '',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Uppercase', value: 'uppercase' },
        { label: 'Lowercase', value: 'lowercase' },
        { label: 'Capitalize', value: 'capitalize' },
      ],
    },
    {
      type: STYLE_TYPES.NUMBER,
      label: 'Line Height',
      property: 'line-height',
      // default: '',
    },
    {
      type: STYLE_TYPES.INPUT,
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
      label: 'Letter Spacing',
      property: 'letter-spacing',
      // default: '',
    },
    {
      type: STYLE_TYPES.SELECT,
      label: 'Font Weight',
      property: 'font-weight',
      min: 0,
      options: [
        { label: '100', value: '100' },
        { label: '200', value: '200' },
        { label: '300', value: '300' },
        { label: '400', value: '400' },
        { label: '500', value: '500' },
        { label: '600', value: '600' },
        { label: '700', value: '700' },
      ],
    },
    {
      type: STYLE_TYPES.SELECT,
      label: 'Text Decoration',
      property: 'text-decoration',
      default: '',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Line Through', value: 'line-through' },
        { label: 'Overline', value: 'overline' },
        { label: 'Underline', value: 'underline' },
      ],
    },
    {
      type: STYLE_TYPES.SELECT,
      label: 'Font Style',
      property: 'font-style',
      default: '',
      options: [
        { label: 'Inherit', value: 'inherit' },
        { label: 'Italic', value: 'italic' },
        { label: 'Oblique', value: 'oblique' },
        { label: 'Normal', value: 'normal' },
      ],
    },
    {
      type: STYLE_TYPES.SELECT,
      label: 'Cursor',
      property: 'cursor',
      default: '',
      options: [
        { label: 'Pointer', value: 'pointer' },
        { label: 'Help', value: 'help' },
        { label: 'Text', value: 'text' },
        { label: 'Move', value: 'move' },
        { label: 'Not Allowed', value: 'not-allowed' },
      ],
    },
    {
      type: STYLE_TYPES.SELECT,
      label: 'White Space',
      property: 'white-space',
      default: '',
      options: [
        { label: 'Pointer', value: 'break-spaces' },
        { label: 'Normal', value: 'normal' },
        { label: 'Nowrap', value: 'nowrap' },
        { label: 'Pre', value: 'pre' },
        { label: 'Pre Line', value: 'pre-line' },
        { label: 'Pre Wrap', value: 'pre-wrap' },
        { label: 'Inherit', value: 'inherit' },
        { label: 'Initial', value: 'initial' },
        { label: 'Revert', value: 'revert' },
        { label: 'Revert Layer', value: 'revert-layer' },
        { label: 'Unset', value: 'unset' },
      ],
    },
  ],
};

const sizingProps = {
  default: '',
  options: [
    { label: 'auto', value: 'auto' },
    { label: 'max-content', value: 'max-content' },
    { label: 'min-content', value: 'min-content' },
    { label: 'fit-content', value: 'fit-content' },
  ],
};
const sizingSector = {
  name: STYLE_MANAGER_SECTION_NAME.SIZING,
  open: false,
  properties: [
    {
      type: STYLE_TYPES.INPUT,
      label: 'Width',
      property: 'width',
      units: Object.values(WIDTH_UNITS),
      ...sizingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      label: 'Height',
      property: 'height',
      units: Object.values(HEIGHT_UNITS),
      ...sizingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      label: 'Max Width',
      property: 'max-width',
      units: Object.values(WIDTH_UNITS),
      ...sizingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      label: 'Max Height',
      property: 'max-height',
      units: Object.values(HEIGHT_UNITS),
      ...sizingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      label: 'Min Width',
      property: 'min-width',
      units: Object.values(WIDTH_UNITS),
      ...sizingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      label: 'Min Height',
      property: 'min-height',
      units: Object.values(HEIGHT_UNITS),
      ...sizingProps,
    },
  ],
};

const spacingProps = {
  default: '',
  options: [{ label: 'auto', value: 'auto' }],
};
const spacingSector = {
  name: STYLE_MANAGER_SECTION_NAME.SPACING,
  open: false,
  properties: [
    {
      type: STYLE_TYPES.INPUT,
      property: 'padding-top',
      default: '',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
    },
    {
      type: STYLE_TYPES.INPUT,
      property: 'margin-top',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
      allowNegativeNumber: true,
      ...spacingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      property: 'padding-bottom',
      default: '',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
    },
    {
      type: STYLE_TYPES.INPUT,
      property: 'margin-bottom',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
      allowNegativeNumber: true,
      ...spacingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      property: 'padding-left',
      default: '',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
    },
    {
      type: STYLE_TYPES.INPUT,
      property: 'margin-left',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
      allowNegativeNumber: true,
      ...spacingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      property: 'padding-right',
      default: '',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
    },
    {
      type: STYLE_TYPES.INPUT,
      property: 'margin-right',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
      allowNegativeNumber: true,
      ...spacingProps,
    },
  ],
};

const borderWidthProps = {
  units: [UNIT_TYPES.PX, UNIT_TYPES.REM],
  type: STYLE_TYPES.INPUT,
  default: '',
};
const borderRadiusProps = {
  units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
  type: STYLE_TYPES.INPUT,
  default: '',
  min: 0,
};
const borderSector = {
  name: STYLE_MANAGER_SECTION_NAME.BORDER,
  open: false,
  properties: [
    {
      type: STYLE_TYPES.SELECT,
      label: 'Style',
      property: 'border-style',
      default: '',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Solid', value: 'solid' },
        { label: 'Dotted', value: 'dotted' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Double', value: 'double' },
        { label: 'Groove', value: 'groove' },
        { label: 'Ridge', value: 'ridge' },
        { label: 'Inset', value: 'inset' },
        { label: 'Outset', value: 'outset' },
      ],
    },
    {
      type: STYLE_TYPES.COLOR,
      label: 'Color',
      property: 'border-color',
    },
    {
      label: 'Top W',
      property: 'border-top-width',
      ...borderWidthProps,
    },
    {
      label: 'Right W',
      property: 'border-right-width',
      ...borderWidthProps,
    },
    {
      label: 'Bottom W',
      property: 'border-bottom-width',
      ...borderWidthProps,
    },
    {
      label: 'Left W',
      property: 'border-left-width',
      ...borderWidthProps,
    },
    {
      label: 'Top Left R',
      property: 'border-top-left-radius',
      ...borderRadiusProps,
    },
    {
      label: 'Top Right R',
      property: 'border-top-right-radius',
      ...borderRadiusProps,
    },
    {
      label: 'Bottom Left R',
      property: 'border-bottom-left-radius',
      ...borderRadiusProps,
    },
    {
      label: 'Bottom Right R',
      property: 'border-bottom-right-radius',
      ...borderRadiusProps,
    },
    {
      type: STYLE_TYPES.SELECT,
      label: 'Outline Style',
      property: 'outline-style',
      default: '',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Solid', value: 'solid' },
        { label: 'Dotted', value: 'dotted' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Double', value: 'double' },
        { label: 'Groove', value: 'groove' },
        { label: 'Ridge', value: 'ridge' },
        { label: 'Inset', value: 'inset' },
        { label: 'Outset', value: 'outset' },
      ],
    },
    {
      label: 'Outline Width',
      property: 'outline-width',
      ...borderRadiusProps,
    },
    {
      type: STYLE_TYPES.COLOR,
      label: 'Outline Color',
      property: 'outline-color',
    },
  ],
};

const boxShadowSector = {
  name: STYLE_MANAGER_SECTION_NAME.BOX_SHADOW,
  open: false,
  properties: [
    {
      type: STYLE_TYPES.SELECT,
      label: 'Box Shadow',
      property: 'box-shadow',
      options: [
        { label: 'Outset', value: 'outset' },
        { label: 'Inset', value: 'inset' },
      ],
    },
  ],
};

const positioningProps = {
  units: [UNIT_TYPES.PX, UNIT_TYPES.VW, UNIT_TYPES.VH, UNIT_TYPES.PERCENT],
  type: STYLE_TYPES.INPUT,
  default: '',
  allowNegativeNumber: true,
  options: [
    { label: 'Unset', value: 'unset' },
    { label: 'Auto', value: 'auto' },
  ],
};
const positioningSector = {
  name: STYLE_MANAGER_SECTION_NAME.POSITION,
  open: false,
  properties: [
    {
      type: STYLE_TYPES.RADIO,
      label: 'Position',
      property: 'position',
      default: 'left',
      colSpan: 2,
      options: [
        {
          label: 'Static',
          value: 'static',
        },
        {
          label: 'Relative',
          value: 'relative',
        },
        {
          label: 'Sticky',
          value: 'sticky',
        },
        {
          label: 'Absolute',
          value: 'absolute',
        },
      ],
    },
    {
      label: 'Top',
      property: 'top',
      ...positioningProps,
    },
    {
      label: 'Right',
      property: 'right',
      ...positioningProps,
    },
    {
      label: 'Left',
      property: 'left',
      ...positioningProps,
    },
    {
      label: 'Bottom',
      property: 'bottom',
      ...positioningProps,
    },
    {
      type: 'number',
      label: 'Z-Index',
      property: 'z-index',
      default: '',
      min: 0,
    },
  ],
};

const backgroundSector = {
  name: STYLE_MANAGER_SECTION_NAME.BACKGROUND,
  open: false,
  properties: [
    {
      type: STYLE_TYPES.COLOR,
      label: 'Background Gradient',
      default: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)',
      property: 'background',
      isFullWidth: true,
    },
    {
      type: STYLE_TYPES.COLOR,
      label: 'Background Color',
      default: 'white',
      property: 'background-color',
      isFullWidth: true,
    },
    {
      type: STYLE_TYPES.COLOR,
      label: 'Background Image',
      property: 'background-image',
      isFullWidth: true,
    },
    {
      type: STYLE_TYPES.SELECT,
      label: 'Background Repeat',
      property: 'background-repeat',
      options: [
        { label: 'Repeat', value: 'repeat' },
        { label: 'Repeat X', value: 'repeat-x' },
        { label: 'Repeat Y', value: 'repeat-y' },
        { label: 'No Repeat', value: 'no-repeat' },
      ],
    },
    {
      type: STYLE_TYPES.RADIO,
      label: 'Background Size',
      default: '',
      property: 'background-size',
      // units: ['px', '%'],
      options: [
        { label: 'Cover', value: 'cover' },
        { label: 'Contain', value: 'contain' },
      ],
    },
    {
      type: STYLE_TYPES.INPUT,
      label: 'Position X',
      default: '',
      property: 'background-position-x',
      units: ['px', '%'],
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      type: STYLE_TYPES.INPUT,
      label: 'Position Y',
      default: '',
      property: 'background-position-y',
      units: ['px', '%'],
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'bottom' },
      ],
    },
  ],
};

export const styleManagerConfig = {
  custom: true,
  sectors: [
    displaySector,
    sizingSector,
    typographySector,
    spacingSector,
    borderSector,
    boxShadowSector,
    positioningSector,
    backgroundSector,
  ],
};

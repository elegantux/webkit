import {
  FaArrowDown as ArrowDownIcon,
  FaArrowLeft as ArrowLeftIcon,
  FaArrowRight as ArrowRightIcon,
  FaArrowUp as ArrowUpIcon,
  FaArrowsUpDown as ArrowsUpDownIcon,
  FaA as AutoIcon,
  FaBan as BanIcon,
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaArrowDown19,
  FaArrowDown91,
  FaArrowsLeftRightToLine,
  FaFont,
  FaHandPointer,
  FaI,
  FaICursor,
  FaItalic,
  FaQuestion,
  FaStrikethrough,
  FaTextHeight,
  FaTextWidth,
  FaUnderline,
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
import {
  LuArrowDownFromLine,
  LuArrowDownToLine,
  LuArrowLeftFromLine,
  LuArrowLeftToLine,
  LuArrowRightFromLine,
  LuArrowRightToLine,
  LuArrowUpFromLine,
  LuArrowUpToLine,
  LuCaseLower,
  LuCaseSensitive,
  LuCaseUpper,
  LuColumns,
} from 'react-icons/lu';
import { ChakraProps, Text } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import BorderTopIcon from '@assets/icons/style-manager/border-top-icon.svg?react';
import BorderLeftIcon from '@assets/icons/style-manager/border-left-icon.svg?react';
import BorderBottomIcon from '@assets/icons/style-manager/border-bottom-icon.svg?react';
import BorderRightIcon from '@assets/icons/style-manager/border-right-icon.svg?react';
import TopLeftRadiusIcon from '@assets/icons/style-manager/top-left-radius-icon.svg?react';
import TopRightRadiusIcon from '@assets/icons/style-manager/top-right-radius-icon.svg?react';
import BottomLeftRadiusIcon from '@assets/icons/style-manager/bottom-left-radius-icon.svg?react';
import BottomRightRadiusIcon from '@assets/icons/style-manager/bottom-right-radius-icon.svg?react';

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
  OTHER: 'Other',
};

export const DISPLAY_FLEX_PROPERTIES = [
  {
    label: 'Flex Wrap',
    property: 'flex-wrap',
    type: STYLE_TYPES.RADIO,
    default: '',
    options: [
      { value: 'nowrap', label: 'No Wrap', icon: BanIcon },
      { value: 'wrap', label: 'Wrap', icon: ArrowDownIcon },
      { value: 'wrap-reverse', label: 'Wrap Reverse', icon: ArrowUpIcon },
    ],
  },
  {
    label: 'Justify Content',
    property: 'justify-content',
    type: STYLE_TYPES.RADIO,
    default: '',
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
    default: '',
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
    default: '',
    colSpan: 2,
    options: [
      { value: 'column', label: 'Column', icon: FaArrowDown19 },
      { value: 'column-reverse', label: 'Column Reverse', icon: FaArrowDown91 },
      { value: 'row', label: 'Row', icon: ArrowRightIcon },
      { value: 'row-reverse', label: 'Row Reverse', icon: ArrowLeftIcon },
    ],
  },
  // {
  //   label: 'Flex',
  //   property: 'flex',
  //   type: STYLE_TYPES.NUMBER,
  //   default: '',
  //   min: 0,
  // },
];

export const DISPLAY_GRID_PROPERTIES = [
  {
    label: 'Grid Columns',
    property: 'grid-template-columns',
    type: STYLE_TYPES.INPUT,
    default: '',
    min: 0,
    leftAddon: <LuColumns size={24} />,
  },
  // {
  //   label: 'Grid Rows',
  //   property: 'grid-template-rows',
  //   type: STYLE_TYPES.INPUT,
  //   default: '',
  //   min: 0,
  // },
];

export const DISPLAY_COMMON_PROPERTIES = [
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
    label: 'Gap',
    property: 'gap',
    type: STYLE_TYPES.INPUT,
    default: '',
    units: ['px', 'vw'],
    min: 0,
    leftAddon: <FaArrowsLeftRightToLine size={18} />,
  },
];

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
    ...DISPLAY_COMMON_PROPERTIES,
    ...DISPLAY_GRID_PROPERTIES,
    ...DISPLAY_FLEX_PROPERTIES,
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
      default: '',
      units: ['px', 'rem'],
      min: 0,
      leftAddon: <FaFont size={14} />,
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
      options: [
        // sans-serif
        {
          label: 'Arial',
          value: 'Arial, sans-serif',
        },
        {
          label: 'Arial Black',
          value: '"Arial Black", "Arial Bold", Gadget, sans-serif',
        },
        {
          label: 'Arial Narrow',
          value: '"Arial Narrow", Arial, sans-serif',
        },
        {
          label: 'Tahoma',
          value: 'Tahoma, Verdana, Segoe, sans-serif',
        },
        {
          label: 'Trebuchet MS',
          value: '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif',
        },
        {
          label: 'Verdana',
          value: 'Verdana, Geneva, sans-serif',
        },
        // serif
        {
          label: 'Georgia',
          value: 'Georgia, serif',
        },
        {
          label: 'Palatino',
          value: 'Palatino, "Palatino Linotype", "Palatino LT STD", serif',
        },
        {
          label: 'Times New Roman',
          value: 'TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif',
        },
      ],
    },
    {
      // Default options
      type: STYLE_TYPES.RADIO,
      label: 'Text Align',
      property: 'text-align',
      default: '',
      options: [
        {
          label: 'Left',
          value: 'left',
          icon: FaAlignLeft,
        },
        {
          label: 'Center',
          value: 'center',
          icon: FaAlignCenter,
        },
        {
          label: 'Right',
          value: 'right',
          icon: FaAlignRight,
        },
        {
          label: 'Justify',
          value: 'justify',
          icon: FaAlignJustify,
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
      type: STYLE_TYPES.RADIO,
      label: 'Transform',
      property: 'text-transform',
      default: '',
      options: [
        {
          label: 'Lowercase',
          value: 'lowercase',
          icon: (props: any) => (
            <LuCaseLower
              {...props}
              size={24}
            />
          ),
        },
        {
          label: 'Capitalize',
          value: 'capitalize',
          icon: (props: any) => (
            <LuCaseSensitive
              {...props}
              size={24}
            />
          ),
        },
        {
          label: 'Uppercase',
          value: 'uppercase',
          icon: (props: any) => (
            <LuCaseUpper
              {...props}
              size={24}
            />
          ),
        },
      ],
    },
    {
      type: STYLE_TYPES.NUMBER,
      label: 'Line Height',
      property: 'line-height',
      leftAddon: <FaTextHeight size={18} />,
      // default: '',
    },
    {
      type: STYLE_TYPES.INPUT,
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM],
      label: 'Letter Spacing',
      property: 'letter-spacing',
      default: '',
      leftAddon: <FaTextWidth size={14} />,
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
      type: STYLE_TYPES.RADIO,
      label: 'Text Decoration',
      property: 'text-decoration',
      default: '',
      options: [
        { label: 'None', value: 'none', icon: BanIcon },
        { label: 'Line Through', value: 'line-through', icon: FaStrikethrough },
        { label: 'Underline', value: 'underline', icon: FaUnderline },
        // { label: 'Overline', value: 'overline' },
      ],
    },
    {
      type: STYLE_TYPES.RADIO,
      label: 'Font Style',
      property: 'font-style',
      default: '',
      options: [
        { label: 'Normal', value: 'normal', icon: FaI },
        { label: 'Italic', value: 'italic', icon: FaItalic },
        // { label: 'Inherit', value: 'inherit' },
        // { label: 'Oblique', value: 'oblique' },
      ],
    },
    {
      type: STYLE_TYPES.RADIO,
      label: 'Cursor',
      property: 'cursor',
      default: '',
      options: [
        { label: 'Pointer', value: 'pointer', icon: FaHandPointer },
        { label: 'Help', value: 'help', icon: FaQuestion },
        { label: 'Text', value: 'text', icon: FaICursor },
        { label: 'Not Allowed', value: 'not-allowed', icon: BanIcon },
        // { label: 'Move', value: 'move' },
      ],
    },
    {
      type: STYLE_TYPES.SELECT,
      label: 'White Space',
      property: 'white-space',
      default: '',
      options: [
        { label: 'Break Spaces', value: 'break-spaces' },
        { label: 'Nowrap', value: 'nowrap' },
        { label: 'Pre', value: 'pre' },
        { label: 'Pre Line', value: 'pre-line' },
        { label: 'Pre Wrap', value: 'pre-wrap' },
        { label: 'Unset', value: 'unset' },
      ],
    },
  ],
};

function WithAddonLabel(props: PropsWithChildren<ChakraProps>) {
  return (
    <Text
      fontWeight="600"
      w="22px"
      fontSize="11px"
      textTransform="uppercase"
      textAlign="center"
      {...props}
    />
  );
}
const sizingProps = {
  default: '',
  options: [
    { label: 'auto', value: 'auto' },
    { label: 'max-content', value: 'max-content' },
    { label: 'min-content', value: 'min-content' },
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
      leftAddon: <WithAddonLabel>W</WithAddonLabel>,
      ...sizingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      label: 'Height',
      property: 'height',
      units: Object.values(HEIGHT_UNITS),
      leftAddon: <WithAddonLabel>H</WithAddonLabel>,
      ...sizingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      label: 'Max Width',
      property: 'max-width',
      units: Object.values(WIDTH_UNITS),
      leftAddon: <WithAddonLabel>Max</WithAddonLabel>,
      hideLabel: true,
      ...sizingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      label: 'Max Height',
      property: 'max-height',
      units: Object.values(HEIGHT_UNITS),
      leftAddon: <WithAddonLabel>Max</WithAddonLabel>,
      hideLabel: true,
      ...sizingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      label: 'Min Width',
      property: 'min-width',
      units: Object.values(WIDTH_UNITS),
      leftAddon: <WithAddonLabel>Min</WithAddonLabel>,
      hideLabel: true,
      ...sizingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      label: 'Min Height',
      property: 'min-height',
      units: Object.values(HEIGHT_UNITS),
      leftAddon: <WithAddonLabel>Min</WithAddonLabel>,
      hideLabel: true,
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
      label: 'Paddings',
      default: '',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
      leftAddon: <LuArrowDownFromLine size={18} />,
    },
    {
      type: STYLE_TYPES.INPUT,
      property: 'margin-top',
      label: 'Margins',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
      allowNegativeNumber: true,
      leftAddon: <LuArrowDownToLine size={18} />,
      ...spacingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      property: 'padding-bottom',
      default: '',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
      leftAddon: <LuArrowUpFromLine size={18} />,
      hideLabel: true,
    },
    {
      type: STYLE_TYPES.INPUT,
      property: 'margin-bottom',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
      allowNegativeNumber: true,
      leftAddon: <LuArrowUpToLine size={18} />,
      hideLabel: true,
      ...spacingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      property: 'padding-left',
      default: '',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
      leftAddon: <LuArrowRightFromLine size={18} />,
      hideLabel: true,
    },
    {
      type: STYLE_TYPES.INPUT,
      property: 'margin-left',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
      allowNegativeNumber: true,
      leftAddon: <LuArrowRightToLine size={18} />,
      hideLabel: true,
      ...spacingProps,
    },
    {
      type: STYLE_TYPES.INPUT,
      property: 'padding-right',
      default: '',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
      leftAddon: <LuArrowLeftFromLine size={18} />,
      hideLabel: true,
    },
    {
      type: STYLE_TYPES.INPUT,
      property: 'margin-right',
      units: [UNIT_TYPES.PX, UNIT_TYPES.REM, UNIT_TYPES.PERCENT],
      allowNegativeNumber: true,
      leftAddon: <LuArrowLeftToLine size={18} />,
      hideLabel: true,
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
      ],
    },
    {
      type: STYLE_TYPES.COLOR,
      label: 'Color',
      property: 'border-color',
    },
    {
      label: 'Top Width',
      property: 'border-top-width',
      leftAddon: (
        <BorderTopIcon
          width="14px"
          height="14px"
        />
      ),
      ...borderWidthProps,
    },
    {
      label: 'Right Width',
      property: 'border-right-width',
      leftAddon: (
        <BorderRightIcon
          width="14px"
          height="14px"
        />
      ),
      ...borderWidthProps,
    },
    {
      label: 'Bottom Width',
      property: 'border-bottom-width',
      leftAddon: (
        <BorderBottomIcon
          width="14px"
          height="14px"
        />
      ),
      ...borderWidthProps,
    },
    {
      label: 'Left Width',
      property: 'border-left-width',
      leftAddon: (
        <BorderLeftIcon
          width="14px"
          height="14px"
        />
      ),
      ...borderWidthProps,
    },
    {
      label: 'Top-Left Radius',
      property: 'border-top-left-radius',
      leftAddon: (
        <TopLeftRadiusIcon
          width="14px"
          height="14px"
        />
      ),
      ...borderRadiusProps,
    },
    {
      label: 'Top-Right Radius',
      property: 'border-top-right-radius',
      leftAddon: (
        <TopRightRadiusIcon
          width="14px"
          height="14px"
        />
      ),
      ...borderRadiusProps,
    },
    {
      label: 'Bottom-Left Radius',
      property: 'border-bottom-left-radius',
      leftAddon: (
        <BottomLeftRadiusIcon
          width="14px"
          height="14px"
        />
      ),
      ...borderRadiusProps,
    },
    {
      label: 'Bottom-Right Radius',
      property: 'border-bottom-right-radius',
      leftAddon: (
        <BottomRightRadiusIcon
          width="14px"
          height="14px"
        />
      ),
      ...borderRadiusProps,
    },
    /*
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
        // { label: 'Double', value: 'double' },
        // { label: 'Groove', value: 'groove' },
        // { label: 'Ridge', value: 'ridge' },
        // { label: 'Inset', value: 'inset' },
        // { label: 'Outset', value: 'outset' },
      ],
    },
    {
      label: 'Outline Width',
      property: 'outline-width',
      leftAddon: <FaRegSquare size={18} />,
      ...borderRadiusProps,
    },
    {
      type: STYLE_TYPES.COLOR,
      label: 'Outline Color',
      default: '',
      property: 'outline-color',
    },
    */
  ],
};

// const boxShadowSector = {
//   name: STYLE_MANAGER_SECTION_NAME.BOX_SHADOW,
//   open: false,
//   properties: [
//     {
//       type: STYLE_TYPES.SELECT,
//       label: 'Box Shadow',
//       property: 'box-shadow',
//       options: [
//         { label: 'Outset', value: 'outset' },
//         { label: 'Inset', value: 'inset' },
//       ],
//     },
//   ],
// };

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
      default: '',
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
    },
  ],
};

const backgroundSector = {
  name: STYLE_MANAGER_SECTION_NAME.BACKGROUND,
  open: false,
  properties: [
    // {
    //   type: STYLE_TYPES.COLOR,
    //   label: 'Background Gradient',
    //   // default: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)',
    //   default: '',
    //   property: 'background',
    //   isFullWidth: true,
    // },
    {
      type: STYLE_TYPES.COLOR,
      label: 'Background Color',
      default: '',
      property: 'background-color',
      isFullWidth: true,
    },
    // {
    //   type: STYLE_TYPES.COLOR,
    //   label: 'Background Image',
    //   property: 'background-image',
    //   isFullWidth: true,
    // },
    // {
    //   type: STYLE_TYPES.SELECT,
    //   label: 'Background Repeat',
    //   property: 'background-repeat',
    //   options: [
    //     { label: 'Repeat', value: 'repeat' },
    //     { label: 'Repeat X', value: 'repeat-x' },
    //     { label: 'Repeat Y', value: 'repeat-y' },
    //     { label: 'No Repeat', value: 'no-repeat' },
    //   ],
    // },
    // {
    //   type: STYLE_TYPES.RADIO,
    //   label: 'Background Size',
    //   default: '',
    //   property: 'background-size',
    //   // units: ['px', '%'],
    //   options: [
    //     { label: 'Cover', value: 'cover' },
    //     { label: 'Contain', value: 'contain' },
    //   ],
    // },
    // {
    //   type: STYLE_TYPES.INPUT,
    //   label: 'Position X',
    //   default: '',
    //   property: 'background-position-x',
    //   units: ['px', '%'],
    //   options: [
    //     { label: 'Left', value: 'left' },
    //     { label: 'Center', value: 'center' },
    //     { label: 'Right', value: 'right' },
    //   ],
    // },
    // {
    //   type: STYLE_TYPES.INPUT,
    //   label: 'Position Y',
    //   default: '',
    //   property: 'background-position-y',
    //   units: ['px', '%'],
    //   options: [
    //     { label: 'Top', value: 'top' },
    //     { label: 'Center', value: 'center' },
    //     { label: 'Bottom', value: 'bottom' },
    //   ],
    // },
  ],
};

const otherSector = {
  name: STYLE_MANAGER_SECTION_NAME.OTHER,
  open: false,
  properties: [
    {
      type: STYLE_TYPES.RADIO,
      label: 'Object Fit',
      property: 'object-fit',
      default: '',
      colSpan: 2,
      options: [
        { label: 'contain', value: 'contain' },
        { label: 'cover', value: 'cover' },
        { label: 'fill', value: 'fill' },
        { label: 'none', value: 'none' },
      ],
    },
    {
      type: STYLE_TYPES.NUMBER,
      label: 'Opacity',
      property: 'opacity',
      default: '',
      min: 0,
      max: 1,
      step: 0.01,
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
    // boxShadowSector,
    backgroundSector,
    positioningSector,
    otherSector,
  ],
};

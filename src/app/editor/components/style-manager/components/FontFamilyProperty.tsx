import { memo } from 'react';
import { Flex, Text } from '@chakra-ui/react';

import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { editorRoute } from '../../../../../routes';
import { useTemplate, useThemeSettings } from '@lib/state.ts';
import { ThemeSettingsFontLink } from '@lib/models/theme-settings';
import { useStyleProperty } from '@app/editor/components/style-manager/lib/utils';
import { SelectOptionProps } from '@ui/atomic/molecules/select/Select';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';
import { SelectProperty } from '@app/editor/components/style-manager/components/SelectPropertyType';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const FontFamilyProperty = memo(({ property }: { property: ExtendedProperty }) => {
  const { templateId } = editorRoute.useParams();
  const { template } = useTemplate(Number(templateId));
  const { themeSettings } = useThemeSettings(template.wtp_project_id);

  const themeSettingsFonts =
    themeSettings?.font_links && themeSettings.font_links.length > 0
      ? JSON.parse(themeSettings.font_links).map((item: ThemeSettingsFontLink) => ({
          label: item.name,
          value: item.name,
        }))
      : [];

  const { value, hasInheritedValue, propertyLabel, propertyOptions } = useStyleProperty(property);

  const hasValue = value.length > 0;

  const selectOptions = [...themeSettingsFonts, ...propertyOptions!].map((item: SelectOptionProps) => ({
    label: <Flex fontFamily={item.value as string}>{item.label}</Flex>,
    value: item.value,
  }));

  const selectedValue = selectOptions!.find((option) => option.value === value) ?? null;

  const handleInputChange = (option: SelectOptionProps | any) => {
    if (option) {
      property.upValue(option.value);
    } else {
      property.upValue('');
    }
  };

  return (
    <Flex direction="column">
      <PropertyHeader
        propertyLabel={propertyLabel}
        hasInheritedValue={hasInheritedValue}
        hasValue={hasValue}
      />
      {propertyOptions ? (
        <SelectProperty
          value={selectedValue}
          options={selectOptions}
          onChange={handleInputChange}
          hasInheritedValue={hasInheritedValue}
        />
      ) : (
        <Text>Property options are not defined</Text>
      )}
    </Flex>
  );
});

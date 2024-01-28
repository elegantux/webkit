import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

import { Template } from '@lib/models/template';

export function TemplateListTable({ templateList }: { templateList: Template[] }) {
  return (
    <TableContainer
      border="1px solid"
      borderColor="grey.200"
      _dark={{ borderColor: 'grey.700' }}
      borderRadius="lg"
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Created At</Th>
            <Th>Updated At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {templateList.map((template) => (
            <Tr
              key={template.id}
              cursor="pointer"
              onClick={() => alert(template.id)}
            >
              <Td>{template.name}</Td>
              <Td>{template.create_datetime}</Td>
              <Td textAlign="right">{template.update_datetime}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

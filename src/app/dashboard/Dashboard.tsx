import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { Swiper as ISwiper } from 'swiper';
import { Navigation, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { AxiosError } from 'axios';

// Import Swiper styles
import 'swiper/css';

import { useProjectList } from '@lib/state';
import { PageHeading } from '@app/dashboard/components/PageComponents';
import { ProjectCard } from '@app/dashboard/project/components/ProjectCard';
import { Project } from '@lib/models/project';
import { api } from '@lib/api';
import { ProjectListEmptyState } from '@app/dashboard/project/components/ProjectListEmptyState';
import { SliderSkeleton } from '@ui/atomic/molecules';
import { getInfoToastObject } from '@lib/utils';

function LastProjectListSlider() {
  const [swiper, setSwiper] = useState<ISwiper>();
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const toast = useToast();

  const loadRecentProjectList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.project.getRecentProjectList();

      const makeDelay = response.data.length > 0;

      if (makeDelay) {
        await new Promise((r) => {
          setTimeout(r, 1000);
        });
      }
      setProjectList(response.data);
    } catch (error: AxiosError | any) {
      const responseErrorMessage = error?.response?.data?.errors?.message ?? 'Something went wrong!';
      toast({
        title: responseErrorMessage,
        status: 'error',
      });
      toast(getInfoToastObject());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecentProjectList();
  }, []);

  return (
    <Box my="42px">
      {isLoading && <SliderSkeleton />}
      {!isLoading && projectList.length === 0 && <ProjectListEmptyState alignItems="center" />}
      {!isLoading && projectList.length > 0 && (
        <>
          <Flex
            justify="space-between"
            align="center"
            mb="14px"
          >
            <Heading
              as="h4"
              size="md"
              mb={0}
            >
              Last Projects
            </Heading>
            <Flex>
              <IconButton
                aria-label=""
                variant="ghost"
                size="sm"
                onClick={() => swiper?.slidePrev()}
                icon={<FaChevronLeft />}
              />
              <IconButton
                aria-label=""
                variant="ghost"
                size="sm"
                onClick={() => swiper?.slideNext()}
                icon={<FaChevronRight />}
              />
            </Flex>
          </Flex>
          <Swiper
            spaceBetween={14}
            slidesPerView={3}
            onInit={(sw) => {
              setSwiper(sw);
            }}
            modules={[Navigation, Scrollbar]}
            breakpoints={{
              '1200': { slidesPerView: 3 },
              '720': { slidesPerView: 2 },
            }}
            style={{ margin: '0 -12px', height: 'max-content' }}
          >
            {projectList.map((project) => (
              <SwiperSlide
                style={{ padding: '12px', height: 'auto' }}
                key={project.id}
              >
                <ProjectCard
                  project={project}
                  showMenu={false}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </Box>
  );
}

function LastTemplateListTable() {
  const { projectList } = useProjectList();

  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        mb="24px"
      >
        <Heading
          as="h4"
          size="md"
          mb={0}
        >
          Last Templates
        </Heading>
      </Flex>
      <TableContainer
        border="1px solid"
        borderColor="grey.200"
        _dark={{ borderColor: 'grey.700' }}
        borderRadius="lg"
      >
        <Table variant="simple">
          {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Created By</Th>
              <Th isNumeric>Created At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {projectList.map((project) => (
              <Tr
                key={project.id}
                cursor="pointer"
                onClick={() => alert(project.id)}
              >
                <Td>{project.name}</Td>
                <Td>{project.app_id}</Td>
                <Td textAlign="right">{project.create_datetime}</Td>
              </Tr>
            ))}
            {/* <Tr */}
            {/*  cursor="pointer" */}
            {/*  onClick={() => alert('hey')} */}
            {/* > */}
            {/*  <Td>inches</Td> */}
            {/*  <Td>millimetres (mm)</Td> */}
            {/*  <Td isNumeric>25.4</Td> */}
            {/* </Tr> */}
            {/* <Tr> */}
            {/*  <Td>feet</Td> */}
            {/*  <Td>centimetres (cm)</Td> */}
            {/*  <Td isNumeric>30.48</Td> */}
            {/* </Tr> */}
            {/* <Tr> */}
            {/*  <Td>yards</Td> */}
            {/*  <Td>metres (m)</Td> */}
            {/*  <Td isNumeric>0.91444</Td> */}
            {/* </Tr> */}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export function Dashboard() {
  return (
    <Container
      maxW="960px"
      padding="3rem 5rem"
    >
      <PageHeading>Dashboard</PageHeading>
      <LastProjectListSlider />
      <Spacer height="62px" />
      <LastTemplateListTable />
    </Container>
  );
}

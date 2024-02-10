import { useCallback, useEffect, useState } from 'react';
import { Box, Container, Flex, Heading, IconButton, Spacer, useToast } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { Swiper as ISwiper } from 'swiper';
import { Navigation, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { AxiosError } from 'axios';

// Import Swiper styles
import 'swiper/css';

import { PageHeading } from '@app/dashboard/components/PageComponents';
import { ProjectCard } from '@app/dashboard/project/components/ProjectCard';
import { Project } from '@lib/models/project';
import { api } from '@lib/api';
import { ProjectListEmptyState } from '@app/dashboard/project/components/ProjectListEmptyState';
import { SliderSkeleton, TableSkeleton } from '@ui/atomic/molecules';
import { getInfoToastObject } from '@lib/utils';
import { Template } from '@lib/models/template';
import { TemplateListTable } from '@app/dashboard/template/components/TemplateListTable';
import { RecentTemplateListEmptyState } from '@app/dashboard/template/components/TemplateListEmptyState';

const FETCH_DELAY = 500;

function RecentProjectListSlider() {
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
          setTimeout(r, FETCH_DELAY);
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
              Recent Projects
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
                <ProjectCard project={project} />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </Box>
  );
}

function RecentTemplateListTable() {
  const [templateList, setTemplateList] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const toast = useToast();

  const loadRecentTemplateList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.template.getRecentTemplateList();

      const makeDelay = response.data.length > 0;

      if (makeDelay) {
        await new Promise((r) => {
          setTimeout(r, FETCH_DELAY);
        });
      }
      setTemplateList(response.data);
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
    loadRecentTemplateList();
  }, []);

  return (
    <>
      {isLoading && <TableSkeleton />}
      {!isLoading && templateList.length === 0 && <RecentTemplateListEmptyState alignItems="center" />}
      {!isLoading && templateList.length > 0 && (
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
              Recent Templates
            </Heading>
          </Flex>
          <TemplateListTable
            templateList={templateList}
            showActions={false}
          />
        </>
      )}
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
      <RecentProjectListSlider />
      <Spacer height="62px" />
      <RecentTemplateListTable />
    </Container>
  );
}

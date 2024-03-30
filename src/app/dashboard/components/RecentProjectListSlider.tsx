import { useCallback, useEffect, useState } from 'react';
import { Swiper as ISwiper } from 'swiper';
import { Box, Flex, Heading, IconButton, useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { Swiper, SwiperSlide } from 'swiper/swiper-react';
import { Navigation, Scrollbar } from 'swiper/types/modules';

import { Project } from '@lib/models/project';
import { api } from '@lib/api.ts';
import { getInfoToastObject } from '@lib/utils';
import { SliderSkeleton } from '@ui/atomic/molecules';
import { ProjectListEmptyState } from '@app/dashboard/project/components/ProjectListEmptyState';
import { ProjectCard } from '@app/dashboard/project/components/ProjectCard';

const FETCH_DELAY = 500;

export function RecentProjectListSlider() {
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

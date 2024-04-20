import { useCallback, useEffect, useState } from 'react';
import { Box, Flex, Grid, Heading, useToast } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa6';
import { AxiosError } from 'axios';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

// Import Swiper styles
import 'swiper/css';

import { ContentSection, PageHeading } from '@app/dashboard/components/PageComponents';
import { Project } from '@lib/models/project';
import { api } from '@lib/api';
import { ProjectListEmptyState } from '@app/dashboard/project/components/ProjectListEmptyState';
import { SliderSkeleton, TableSkeleton } from '@ui/atomic/molecules';
import { getInfoToastObject } from '@lib/utils';
import { Template } from '@lib/models/template';
import { TemplateListTable } from '@app/dashboard/template/components/TemplateListTable';
import { ProjectProgressCard } from '@app/dashboard/project/components/ProjectProgressCard';
import { RecentTemplateListEmptyState } from '@app/dashboard/template/components/TemplateListEmptyState';
import { PageContainer } from '@ui/atomic/templates/PageContainer';
import { projectListRoute } from '../../routes';

import Ornament76 from '@assets/decorations/ornament-76.svg?react';

const FETCH_DELAY = 500;

function RecentProjectList() {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { t } = useTranslation();
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
      setProjectList(response.data.slice(0, 3));
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
            mb="24px"
          >
            <Heading
              as="h4"
              size="md"
              mb={0}
            >
              {t('Recent Projects')}
            </Heading>
            <Flex
              as={Link}
              to={projectListRoute.to}
              params={{}}
              alignItems="center"
              gap="8px"
            >
              {t('See all')}
              <FaArrowRight />
            </Flex>
          </Flex>
          <Grid
            gridTemplateColumns="repeat(3, 1fr)"
            gap="32px"
          >
            {projectList.map((project) => (
              <ProjectProgressCard
                key={project.id}
                project={project}
              />
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}

function RecentTemplateListTable() {
  const [templateList, setTemplateList] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { t } = useTranslation();
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
              {t('Recent Templates')}
            </Heading>
          </Flex>
          <ContentSection>
            <TemplateListTable
              templateList={templateList}
              showActions={false}
            />
          </ContentSection>
        </>
      )}
    </>
  );
}

export function Dashboard() {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <PageHeading>{t('Dashboard')}</PageHeading>
      <RecentProjectList />
      <Flex
        my="32px"
        opacity="1"
        color="grey.100"
        _dark={{ color: 'ebony.700' }}
        justify="flex-end"
        width="180px"
        height="50px"
        ml="auto"
      >
        <Ornament76 />
      </Flex>
      <RecentTemplateListTable />
    </PageContainer>
  );
}

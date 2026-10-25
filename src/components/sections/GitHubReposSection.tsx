import React from "react";
import { fetchGitHubRepos } from "@/lib/github";
import { GitHubReposScroll } from "@/components/sections/GitHubReposScroll";

interface GitHubReposSectionProps {
  title?: string;
  subtitle?: string;
  badge?: string;
}

export async function GitHubReposSection({
  title,
  subtitle,
  badge,
}: GitHubReposSectionProps = {}) {
  const repos = await fetchGitHubRepos();

  if (repos.length === 0) {
    return null;
  }

  return (
    <GitHubReposScroll
      initialRepos={repos}
      title={title}
      subtitle={subtitle}
      badge={badge}
    />
  );
}

export default GitHubReposSection;

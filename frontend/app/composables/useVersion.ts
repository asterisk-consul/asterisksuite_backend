import versions from '~~/versiones/versions.json'

export const useVersion = () => {
  const latest = versions[versions.length - 1]

  return {
    version: latest?.version,
    stage: latest?.stage,
    notes: latest?.notes
  }
}

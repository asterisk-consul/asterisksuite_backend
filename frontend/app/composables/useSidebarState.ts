export const useSidebarState = () => {
  const mainCollapsed = useState('main-sidebar-collapsed', () => false)
  return { mainCollapsed }
}

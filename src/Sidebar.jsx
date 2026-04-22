import { Logo } from './Logo'
import { useTheme } from './ThemeContext'

function Sidebar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="sidebar">

<div className="sidebar-logo">
  <Logo />
</div>

      <div className="sidebar-bottom">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

    </div>
  )
}

export default Sidebar
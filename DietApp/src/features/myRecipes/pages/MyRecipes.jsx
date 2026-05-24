import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { getProfileByUsername } from '../../profile/services/profile.service.js';
import './MyRecipes.css';

const PROFILE_USERNAME = 'pamelagrhz';

export default function MyRecipes() {
  const [username, setUsername] = useState(PROFILE_USERNAME);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getProfileByUsername(PROFILE_USERNAME);
        if (user?.username) {
          setUsername(user.username);
        }
      } catch {
        setUsername(PROFILE_USERNAME);
      }
    };

    loadUser();
  }, []);

  return (
    <main className="my-recipes-page">
      <h1 className="my-recipes-title">Mis Recetas de {username}</h1>

      <nav className="my-recipes-tabs" aria-label="Secciones de mis recetas">
        <NavLink
          to="/my-recipes/recipes"
          className={({ isActive }) =>
            isActive ? 'my-recipes-tab-link my-recipes-tab-link-active' : 'my-recipes-tab-link'
          }
        >
          MY RECIPES
        </NavLink>
        <NavLink
          to="/my-recipes/favourites"
          className={({ isActive }) =>
            isActive ? 'my-recipes-tab-link my-recipes-tab-link-active' : 'my-recipes-tab-link'
          }
        >
          FAVOURITES
        </NavLink>
      </nav>

      <section className="my-recipes-content">
        <Outlet />
      </section>
    </main>
  );
}

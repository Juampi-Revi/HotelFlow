import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';

export const CategoriesSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await categoryService.getAllCategories();
        setCategories(list.filter((c) => c.isActive !== false));
      } catch (err) {
        setCategories([]);
      }
    };
    load();
  }, []);

  const handleClick = (id) => {
    navigate(`/rooms?categoryIds=${id}`);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          {t('categories.title')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 col-span-2 md:col-span-3">
              {t('common.loading')}
            </div>
          )}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center transition-colors duration-200 hover:shadow-lg hover:scale-105 border border-gray-200 dark:border-gray-700"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-300 font-bold text-xl">
                  {cat.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {cat.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {cat.slug}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

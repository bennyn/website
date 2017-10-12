const Category = require('../../../../models/Category');
const Playlist = require('../../../../models/Playlist');

class CategoriesRouter {
  static get PATH() {
    return {
      V1_CATEGORY: '/rest/service/v1/category',
      V1_CATEGORIES: '/rest/service/v1/categories',
    }
  }

  constructor() {
    this.cache = {};
    this.getCategories = this.getCategories.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
  }

  filterCategories(categories) {
    return categories.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }

  getCategories(request, reply) {
    const categories = Promise.resolve()
      .then(() => {
        const cachedResponse = this.cache[CategoriesRouter.PATH.V1_CATEGORIES];
        return (cachedResponse) ? cachedResponse : this.queryCategories();
      })
      .then((categories) => this.filterCategories(categories))
      .then((filteredCategories) => (this.cache[CategoriesRouter.PATH.V1_CATEGORIES] = filteredCategories));

    return reply(categories);
  }

  getPlaylists(request, reply) {
    const {category_id} = request.params;

    const playlists = Promise.resolve()
      .then(() => {
        const cachedResponse = this.cache[CategoriesRouter.PATH.V1_CATEGORY];
        return (cachedResponse) ? cachedResponse : this.queryPlaylistsByCategoryId(category_id);
      });

    reply(playlists);
  }

  queryCategories() {
    return Category
      .query()
      .select([
        'id',
        'color',
        'name',
      ]);
  }

  queryPlaylistsByCategoryId(category_id) {
    return Playlist.query().where('category_id', category_id);
  }

  resetCache() {
    this.cache = {};
  }
}

module.exports = CategoriesRouter;

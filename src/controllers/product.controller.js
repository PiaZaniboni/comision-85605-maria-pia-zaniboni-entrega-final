import { ProductService } from '../services/product.service.js';
import { ProductDTO } from '../dto/product.dto.js';

export class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  // GET /api/products - Listar productos
  getAll = async (req, res, next) => {
    try {
      const { limit = 10, page = 1, category, sort } = req.query;

      const filter = {};
      if (category) filter.category = category;

      const options = {
        limit: Number(limit),
        page: Number(page),
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined
      };

      const result = await this.productService.getAllProducts(filter, options);

      res.json({
        status: 'success',
        payload: result. products. map(p => ProductDTO.forList(p)),
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.page > 1,
        hasNextPage: result.page < result. totalPages,
        prevPage:  result.page > 1 ?  result.page - 1 :  null,
        nextPage: result.page < result.totalPages ?  result.page + 1 :  null
      });

    } catch (err) {
      next(err);
    }
  }

  // GET /api/products/:id - Obtener producto por ID
  getById = async (req, res, next) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      res.json(ProductDTO.fromModel(product));
    } catch (err) {
      if (err.code === 'PRODUCT_NOT_FOUND') {
        return res.status(404).json({ error: 'Product not found' });
      }
      next(err);
    }
  }

  // POST /api/products - Crear producto (solo admin)
  create = async (req, res, next) => {
    try {
      const { title, description, code, price, stock, category, thumbnails } = req.body;

      if (!title || !description || !code || price == null || stock == null || ! category) {
        return res. status(422).json({ 
          message: 'title, description, code, price, stock, category are required' 
        });
      }

      const product = await this.productService.createProduct(req.body);

      res.status(201)
         .location(`/api/products/${product._id}`)
         .json(ProductDTO.fromModel(product));

    } catch (err) {
      if (err.code === 'CODE_EXISTS') {
        return res.status(409).json({ message: 'Product code already exists' });
      }
      next(err);
    }
  }

  // PUT /api/products/:id - Actualizar producto (solo admin)
  update = async (req, res, next) => {
    try {
      const { title, description, code, price, category } = req.body;

      if (!title || !description || !code || price == null || !category) {
        return res.status(422).json({ 
          message: 'title, description, code, price, category are required' 
        });
      }

      const updated = await this.productService.updateProduct(req.params.id, req.body);
      res.json(ProductDTO.fromModel(updated));

    } catch (err) {
      if (err.code === 'PRODUCT_NOT_FOUND') {
        return res.status(404).json({ error: 'Product not found' });
      }
      if (err.code === 'CODE_EXISTS') {
        return res.status(409).json({ message: 'Product code already exists' });
      }
      next(err);
    }
  }

  // DELETE /api/products/:id - Eliminar producto (solo admin)
  delete = async (req, res, next) => {
    try {
      await this.productService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (err) {
      if (err.code === 'PRODUCT_NOT_FOUND') {
        return res.status(404).json({ error: 'Product not found' });
      }
      next(err);
    }
  }
}
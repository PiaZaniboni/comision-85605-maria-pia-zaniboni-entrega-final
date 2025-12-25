export class ProductDTO {
  
  static fromModel(product) {
    return {
      id: product._id || product.id,
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails || [],
      status: product.status
    };
  }

  static forList(product) {
    return {
      id: product._id || product. id,
      title: product. title,
      code: product.code,
      price: product.price,
      stock: product.stock,
      category: product.category,
      status: product.status
    };
  }
}
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

const EditModal = ({ product, onClose, onSave }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [categoryId, setCategoryId] = useState(product.category_id || "");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        setError("Không thể lấy danh sách danh mục!");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category_id", categoryId);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${product.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
      onSave();
      onClose();
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi khi cập nhật sản phẩm!");
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header className="bg-warning text-white">
        <Modal.Title>Chỉnh Sửa Sản Phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tên Sản Phẩm</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Giá (VND)</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Danh Mục</Form.Label>
            <Form.Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hình Ảnh</Form.Label>
            <Form.Control
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {product.image && !image && (
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "100px", marginTop: "10px" }}
              />
            )}
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Lưu Thay Đổi
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditModal;
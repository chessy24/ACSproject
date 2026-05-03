import { useEffect, useState } from "react";
import backendUrl from "../../config";

function AdminArchivedProducts() {
    const [products, setProducts] = useState([]);

    const fetchArchived = async () => {
        const res = await fetch(`${backendUrl}/api/products/archived`);
        const data = await res.json();
        setProducts(data);
    };

    useEffect(() => {
        fetchArchived();
    }, []);

    const restoreProduct = async (id) => {
        await fetch(`${backendUrl}/api/products/${id}/restore`, {
            method: "PUT",
        });

        // remove from UI after restore
        setProducts((prev) => prev.filter((p) => p._id !== id));
    };
    const deleteProduct = async (id) => {
        const confirmDelete = window.confirm(
            "This will permanently delete the product. Continue?"
        );

        if (!confirmDelete) return;

        await fetch(`${backendUrl}/api/products/${id}`, {
            method: "DELETE",
        });

        // remove from UI
        setProducts((prev) => prev.filter((p) => p._id !== id));
    };
    return (
        <div>
            <h1 style={{ color: "black" }}>Archived Products</h1>
            {products.map((p) => (
                <div key={p._id}>
                    <img src={p.image} width="80" />
                    <h3>{p.name}</h3>

                    <button onClick={() => restoreProduct(p._id)}>
                        Restore ♻️
                    </button>

                    <button
                        onClick={() => deleteProduct(p._id)}
                        style={{ marginLeft: "10px", color: "red" }}
                    >
                        Delete ❌
                    </button>
                </div>
            ))}
        </div>
    );
}

export default AdminArchivedProducts;
import {
	Component,
	h,
	createComponent,
	createStore,
	createActions,
	connect,
	lazy,
	hFragment,
	createSlot,
	createSlotContent,
} from "../../../packages/runtime/dist/glyphui.js";

// Create a simple Suspense component since it's not exported from the library
class Suspense extends Component {
	constructor(props) {
		super(props, { initialState: { isLoading: true } });
	}

	render(props, state) {
		const { fallback, children } = props;

		// If we're still loading, show the fallback UI
		if (state.isLoading) {
			return fallback;
		}

		// Otherwise, show the children
		return children[0];
	}

	mounted() {
		// Attempt to load the lazy component
		Promise.resolve(this.props.children[0])
			.then(() => {
				this.setState({ isLoading: false });
			})
			.catch((error) => {
				console.error("Error loading component:", error);
				this.setState({ isLoading: false });
			});
	}
}

// Product data with Unsplash images
const products = [
	{
		id: 1,
		name: "Minimalist Watch",
		price: 149.99,
		category: "accessories",
		image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
		description:
			"A sleek, minimalist watch with a clean design. Perfect for everyday wear or special occasions.",
	},
	{
		id: 2,
		name: "Wireless Headphones",
		price: 199.99,
		category: "electronics",
		image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
		description:
			"Premium wireless headphones with noise cancellation and exceptional sound quality.",
	},
	{
		id: 3,
		name: "Leather Wallet",
		price: 79.99,
		category: "accessories",
		image: "https://images.unsplash.com/photo-1627123424574-724758594e93",
		description:
			"Handcrafted genuine leather wallet with multiple card slots and a sleek profile.",
	},
	{
		id: 4,
		name: "Smart Speaker",
		price: 129.99,
		category: "electronics",
		image: "https://images.unsplash.com/photo-1589003077984-894e133dabab",
		description:
			"Voice-controlled smart speaker with premium sound and smart home integration.",
	},
	{
		id: 5,
		name: "Ceramic Mug",
		price: 24.99,
		category: "home",
		image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
		description:
			"Handmade ceramic mug, perfect for your morning coffee or evening tea.",
	},
	{
		id: 6,
		name: "Desk Lamp",
		price: 89.99,
		category: "home",
		image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
		description:
			"Modern desk lamp with adjustable brightness and color temperature.",
	},
	{
		id: 7,
		name: "Canvas Backpack",
		price: 69.99,
		category: "accessories",
		image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7",
		description:
			"Durable canvas backpack with multiple compartments, perfect for daily use or weekend trips.",
	},
	{
		id: 8,
		name: "Bluetooth Speaker",
		price: 79.99,
		category: "electronics",
		image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
		description:
			"Portable Bluetooth speaker with 20-hour battery life and water resistance.",
	},
];

// Lazy load components
const ProductDetail = lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(ProductDetailComponent);
		}, 500); // Simulate network delay
	});
});

const Cart = lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(CartComponent);
		}, 500); // Simulate network delay
	});
});

// Create store for global state management
const useShopStore = createStore({
	cart: [],
	activeCategory: "all",
	sortOrder: "default",
	currentProductId: null,
	showCart: false,
});

// Create actions for the store
const shopActions = createActions(useShopStore, (setState, getState) => ({
	addToCart: (product) => {
		const { cart } = getState();
		const existingItem = cart.find((item) => item.id === product.id);

		if (existingItem) {
			// If item exists, update quantity
			const updatedCart = cart.map((item) =>
				item.id === product.id
					? { ...item, quantity: item.quantity + 1 }
					: item
			);
			setState({ cart: updatedCart });
		} else {
			// Add new item
			setState({ cart: [...cart, { ...product, quantity: 1 }] });
		}
	},

	removeFromCart: (productId) => {
		const { cart } = getState();
		setState({ cart: cart.filter((item) => item.id !== productId) });
	},

	updateQuantity: (productId, quantity) => {
		const { cart } = getState();
		if (quantity <= 0) {
			setState({ cart: cart.filter((item) => item.id !== productId) });
		} else {
			setState({
				cart: cart.map((item) =>
					item.id === productId ? { ...item, quantity } : item
				),
			});
		}
	},

	setActiveCategory: (category) => {
		setState({ activeCategory: category });
	},

	setSortOrder: (sortOrder) => {
		setState({ sortOrder });
	},

	viewProduct: (productId) => {
		setState({ currentProductId: productId });
	},

	closeProductDetail: () => {
		setState({ currentProductId: null });
	},

	toggleCart: () => {
		setState({ showCart: !getState().showCart });
	},

	closeCart: () => {
		setState({ showCart: false });
	},

	checkout: () => {
		alert("Thank you for your purchase!");
		setState({ cart: [], showCart: false });
	},
}));

// Modal component for reuse
class Modal extends Component {
	render(props) {
		return h("div", { class: "modal-overlay" }, [
			h("div", { class: "modal" }, [
				h("div", { class: "modal-header" }, [
					createSlot("header", "Modal Title"),
					h(
						"button",
						{
							class: "close-button",
							on: { click: props.onClose },
						},
						["×"]
					),
				]),
				h("div", { class: "modal-content" }, [
					createSlot("content", "Modal Content"),
				]),
			]),
		]);
	}
}

// ProductCard component
const ProductCard = createComponent((props) => {
	const { product } = props;
	const imageUrl = `${product.image}?auto=format&fit=crop&w=600&h=400`;

	return h("div", { class: "product-card" }, [
		h("img", {
			class: "product-image",
			src: imageUrl,
			alt: product.name,
		}),
		h("div", { class: "product-info" }, [
			h("h3", { class: "product-title" }, [product.name]),
			h("div", { class: "product-price" }, [
				`$${product.price.toFixed(2)}`,
			]),
			h("div", { class: "product-actions" }, [
				h(
					"button",
					{
						on: {
							click: () => shopActions.viewProduct(product.id),
						},
					},
					["View Details"]
				),
				h(
					"button",
					{
						on: { click: () => shopActions.addToCart(product) },
					},
					["Add to Cart"]
				),
			]),
		]),
	]);
});

// ProductGrid component
class ProductGrid extends Component {
	getFilteredProducts(products, activeCategory, sortOrder) {
		// Filter by category
		let filtered =
			activeCategory === "all"
				? products
				: products.filter((p) => p.category === activeCategory);

		// Sort products
		switch (sortOrder) {
			case "price-low":
				return [...filtered].sort((a, b) => a.price - b.price);
			case "price-high":
				return [...filtered].sort((a, b) => b.price - a.price);
			case "name":
				return [...filtered].sort((a, b) =>
					a.name.localeCompare(b.name)
				);
			default:
				return filtered;
		}
	}

	render(props, state) {
		const { activeCategory, sortOrder } = props.store;
		const filteredProducts = this.getFilteredProducts(
			products,
			activeCategory,
			sortOrder
		);

		return h("div", { class: "product-grid" }, [
			filteredProducts.map((product) =>
				h(ProductCard, { product, key: product.id })
			),
		]);
	}
}

// Connect ProductGrid to the store
const ConnectedProductGrid = connect(useShopStore)(ProductGrid);

// FilterBar component
class FilterBar extends Component {
	render(props) {
		const { activeCategory, sortOrder } = props.store;
		const categories = ["all", "electronics", "accessories", "home"];

		return h("div", { class: "filter-bar" }, [
			h("div", { class: "filter-options" }, [
				categories.map((category) =>
					h(
						"button",
						{
							class: `filter-btn ${
								activeCategory === category ? "active" : ""
							}`,
							on: {
								click: () =>
									shopActions.setActiveCategory(category),
							},
						},
						[category.charAt(0).toUpperCase() + category.slice(1)]
					)
				),
			]),
			h("div", { class: "sort-options" }, [
				h(
					"select",
					{
						class: "sort-select",
						on: {
							change: (e) =>
								shopActions.setSortOrder(e.target.value),
						},
					},
					[
						h("option", { value: "default" }, ["Featured"]),
						h("option", { value: "price-low" }, [
							"Price: Low to High",
						]),
						h("option", { value: "price-high" }, [
							"Price: High to Low",
						]),
						h("option", { value: "name" }, ["Name"]),
					]
				),
			]),
		]);
	}
}

// Connect FilterBar to the store
const ConnectedFilterBar = connect(useShopStore)(FilterBar);

// ProductDetail component
class ProductDetailComponent extends Component {
	render(props) {
		const { currentProductId } = props.store;
		const product = products.find((p) => p.id === currentProductId);

		if (!product) return null;

		const imageUrl = `${product.image}?auto=format&fit=crop&w=1200&h=800`;

		return h(Modal, { onClose: shopActions.closeProductDetail }, [
			createSlotContent("header", [product.name]),
			createSlotContent("content", [
				h("div", { class: "product-detail" }, [
					h("img", {
						class: "product-detail-image",
						src: imageUrl,
						alt: product.name,
					}),
					h("div", { class: "product-detail-info" }, [
						h("h2", { class: "product-detail-title" }, [
							product.name,
						]),
						h("div", { class: "product-detail-price" }, [
							`$${product.price.toFixed(2)}`,
						]),
						h("p", { class: "product-detail-description" }, [
							product.description,
						]),
						h(
							"button",
							{
								class: "add-to-cart-btn",
								on: {
									click: () => shopActions.addToCart(product),
								},
							},
							["Add to Cart"]
						),
					]),
				]),
			]),
		]);
	}
}

// Connect ProductDetail to the store
const ConnectedProductDetail = connect(useShopStore)(ProductDetailComponent);

// CartItem component
const CartItem = createComponent((props) => {
	const { item } = props;
	const imageUrl = `${item.image}?auto=format&fit=crop&w=200&h=200`;

	return h("div", { class: "cart-item" }, [
		h("img", { class: "cart-item-image", src: imageUrl, alt: item.name }),
		h("div", { class: "cart-item-details" }, [
			h("h4", {}, [item.name]),
			h("div", {}, [`$${item.price.toFixed(2)}`]),
			h("div", { class: "cart-item-actions" }, [
				h("div", { class: "quantity-control" }, [
					h(
						"div",
						{
							class: "quantity-btn",
							on: {
								click: () =>
									shopActions.updateQuantity(
										item.id,
										item.quantity - 1
									),
							},
						},
						["-"]
					),
					h("span", { class: "quantity" }, [item.quantity]),
					h(
						"div",
						{
							class: "quantity-btn",
							on: {
								click: () =>
									shopActions.updateQuantity(
										item.id,
										item.quantity + 1
									),
							},
						},
						["+"]
					),
				]),
				h(
					"button",
					{
						on: {
							click: () => shopActions.removeFromCart(item.id),
						},
					},
					["Remove"]
				),
			]),
		]),
	]);
});

// Cart component
class CartComponent extends Component {
	calculateTotal(cart) {
		return cart.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);
	}

	render(props) {
		const { cart } = props.store;
		const total = this.calculateTotal(cart);

		return h(Modal, { onClose: shopActions.closeCart }, [
			createSlotContent("header", ["Your Cart"]),
			createSlotContent("content", [
				cart.length === 0
					? h("div", { class: "empty-cart" }, [
							"Your cart is empty. Start shopping!",
					  ])
					: hFragment([
							...cart.map((item) =>
								h(CartItem, { item, key: item.id })
							),
							h("div", { class: "cart-summary" }, [
								h("div", { class: "cart-total" }, [
									h("span", {}, ["Total:"]),
									h("span", {}, [`$${total.toFixed(2)}`]),
								]),
								h(
									"button",
									{
										class: "checkout-btn",
										on: { click: shopActions.checkout },
									},
									["Checkout"]
								),
							]),
					  ]),
			]),
		]);
	}
}

// Connect Cart to the store
const ConnectedCart = connect(useShopStore)(CartComponent);

// Header component with cart icon
class Header extends Component {
	getCartItemCount(cart) {
		return cart.reduce((count, item) => count + item.quantity, 0);
	}

	render(props) {
		const { cart } = props.store;
		const itemCount = this.getCartItemCount(cart);

		return h("header", { class: "header" }, [
			h("div", { class: "container" }, [
				h("nav", { class: "nav" }, [
					h("div", { class: "nav-logo" }, ["GlyphShop"]),
					h("div", { class: "nav-links" }, [
						h(
							"div",
							{
								class: "cart-icon",
								on: { click: shopActions.toggleCart },
							},
							[
								"🛒",
								itemCount > 0
									? h("span", { class: "cart-count" }, [
											itemCount,
									  ])
									: null,
							]
						),
					]),
				]),
			]),
		]);
	}
}

// Connect Header to the store
const ConnectedHeader = connect(useShopStore)(Header);

// Main App component
class App extends Component {
	render(props, state) {
		const { currentProductId, showCart } = props.store;

		return h("div", {}, [
			h(ConnectedHeader),
			h("main", { class: "container" }, [
				h("h1", {}, ["Featured Products"]),
				h(ConnectedFilterBar),
				h(ConnectedProductGrid),
			]),
			h("footer", { class: "footer container" }, [
				"© 2023 GlyphShop. Built with GlyphUI.",
			]),
			currentProductId &&
				h(
					Suspense,
					{
						fallback: h("div", { class: "modal-overlay" }, [
							h("div", { class: "modal" }, [
								h("div", { class: "modal-content" }, [
									"Loading...",
								]),
							]),
						]),
					},
					[h(ConnectedProductDetail)]
				),
			showCart &&
				h(
					Suspense,
					{
						fallback: h("div", { class: "modal-overlay" }, [
							h("div", { class: "modal" }, [
								h("div", { class: "modal-content" }, [
									"Loading cart...",
								]),
							]),
						]),
					},
					[h(ConnectedCart)]
				),
		]);
	}
}

// Connect App to the store
const ConnectedApp = connect(useShopStore)(App);

// Mount the app
const app = new ConnectedApp();
app.mount(document.getElementById("app"));

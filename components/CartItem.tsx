import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

// NEW: Use this in the parent cart list `keyExtractor`.
// It differentiates identical menu items by their selected customizations.
export const cartItemKey = (item: CartItemType) => {
    const custom = (item.customizations ?? [])
        .map((c) => `${c.name}:${Number(c.price ?? 0)}`)
        .sort()
        .join("|");

    return `${item.id}__${custom}`;
};

const CartItem = ({ item }: { item: CartItemType }) => {
    const { increaseQty, decreaseQty, removeItem } = useCartStore();
    const customizations = item.customizations ?? [];

    // Group repeated customizations into a single row with qty.
    // This is needed because ProductDetails "expands" qty into duplicates (Bacon-0, Bacon-1, ...).
    const groupedCustomizations = useMemo(() => {
        const map = new Map<string, { name: string; qty: number; unitPrice: number }>();

        for (const c of customizations) {
            const key = c.name; // name already includes "Topping:" / "Side:" prefix
            const prev = map.get(key);
            if (prev) {
                prev.qty += 1;
            } else {
                map.set(key, { name: c.name, qty: 1, unitPrice: Number(c.price ?? 0) });
            }
        }

        return Array.from(map.values());
    }, [customizations]);

    // Compute total extras price for this cart item (just for display)
    const customizationsTotal = useMemo(() => {
        return groupedCustomizations.reduce((sum, c) => sum + c.qty * c.unitPrice, 0);
    }, [groupedCustomizations]);

    return (
        <View className="cart-item flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-x-3 flex-1">
                <View className="cart-item__image">
                    <Image
                        source={{ uri: item.image_url }}
                        className="size-4/5 rounded-lg"
                        resizeMode="cover"
                    />
                </View>

                <View className="flex-1">
                    <Text className="base-bold text-dark-100">{item.name}</Text>
                    <Text className="paragraph-bold text-primary mt-1">
                        ${item.price}
                    </Text>

                    {groupedCustomizations.length > 0 ? (
                        <View className="mt-2">
                            <Text className="paragraph-bold text-dark-100">Toppings</Text>

                            {groupedCustomizations.map((c, index) => (
                                <View
                                    key={`${c.name}-${index}`}
                                    className="flex flex-row items-center justify-between mt-1"
                                >
                                    <Text className="paragraph-medium text-gray-200">
                                        {c.name}{c.qty > 1 ? ` x${c.qty}` : ""}
                                    </Text>
                                    <Text className="paragraph-medium text-gray-200">
                                        ${(c.qty * c.unitPrice).toFixed(2)}
                                    </Text>
                                </View>
                            ))}

                            <View className="flex flex-row items-center justify-between mt-2">
                                <Text className="paragraph-bold text-dark-100">Extras total</Text>
                                <Text className="paragraph-bold text-primary">
                                    ${customizationsTotal.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    ) : null}

                    <View className="flex flex-row items-center gap-x-4 mt-2">
                        <TouchableOpacity
                            onPress={() => decreaseQty(item.id, customizations)}
                            className="cart-item__actions"
                        >
                            <Image
                                source={images.minus}
                                className="size-1/2"
                                resizeMode="contain"
                                tintColor={"#FF9C01"}
                            />
                        </TouchableOpacity>

                        <Text className="base-bold text-dark-100">{item.quantity}</Text>

                        <TouchableOpacity
                            onPress={() => increaseQty(item.id, customizations)}
                            className="cart-item__actions"
                        >
                            <Image
                                source={images.plus}
                                className="size-1/2"
                                resizeMode="contain"
                                tintColor={"#FF9C01"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => removeItem(item.id, customizations)}
                className="flex-center ml-2 shrink-0"
            >
                <Image source={images.trash} className="size-5" resizeMode="contain" />
            </TouchableOpacity>
        </View>
    );
};

export default CartItem;
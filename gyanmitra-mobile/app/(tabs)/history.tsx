// app/(tabs)/history.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; // ADD THIS
import { GestureHandlerRootView } from "react-native-gesture-handler";
import conversationService from "@/services/conversationService";
import ConversationCard from "@/components/history/ConversationCard";
import HistoryEmptyState from "@/components/history/HistoryEmptyState";
import Colors from "@/constants/Colors";
import type { Conversation } from "@/types/chat";

export default function HistoryScreen() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch conversations
  const fetchConversations = async (pageNum: number, refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await conversationService.getConversations(pageNum, 10);

      if (refresh || pageNum === 1) {
        setConversations(response.data);
      } else {
        setConversations((prev) => [...prev, ...response.data]);
      }

      setHasMore(response.pagination.hasMore);
      setPage(pageNum);
    } catch (error: any) {
      console.error("Failed to fetch conversations:", error);
      Alert.alert("Error", "Failed to load conversations. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  // Auto-refresh when screen comes into focus (ADD THIS)
  useFocusEffect(
    useCallback(() => {
      console.log("📜 History tab focused - refreshing...");
      fetchConversations(1, true);
    }, [])
  );

  // Pull to refresh
  const handleRefresh = useCallback(() => {
    fetchConversations(1, true);
  }, []);

  // Load more (pagination)
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchConversations(page + 1);
    }
  }, [isLoadingMore, hasMore, page]);

  // Navigate to chat with conversationId
  const handleCardPress = useCallback(
    (conversation: Conversation) => {
      router.push({
        pathname: "/(tabs)/",
        params: { conversationId: conversation.id },
      });
    },
    [router]
  );

  // Delete conversation
  const handleDelete = useCallback(async (id: string) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await conversationService.deleteConversation(id);

              // Remove from UI
              setConversations((prev) => prev.filter((conv) => conv.id !== id));

              Alert.alert("Success", "Conversation deleted");
            } catch (error: any) {
              console.error("Failed to delete conversation:", error);
              Alert.alert("Error", "Failed to delete conversation");
            }
          },
        },
      ]
    );
  }, []);

  // Render conversation card
  const renderItem = ({ item }: { item: Conversation }) => (
    <ConversationCard
      conversation={item}
      onPress={() => handleCardPress(item)}
      onDelete={handleDelete}
    />
  );

  // Render footer (loading more)
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={Colors.primary.solid} />
      </View>
    );
  };

  // Key extractor
  const keyExtractor = (item: Conversation) => item.id;

  // Loading state (first load only)
  if (isLoading && conversations.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.solid} />
      </View>
    );
  }

  // Empty state
  if (conversations.length === 0 && !isLoading) {
    return <HistoryEmptyState />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary.solid}
            colors={[Colors.primary.solid]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingVertical: 12,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

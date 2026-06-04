#ifndef AVL_TREE_H
#define AVL_TREE_H

#include <string>
#include <iostream>
#include <vector>

struct Donor {
    std::string id;
    std::string name;
    std::string bloodGroup;
    std::string district;
    std::string lastDonationDate; // Format: YYYY-MM-DD
    bool isAvailable;
};

struct AVLNode {
    Donor donor;
    AVLNode* left;
    AVLNode* right;
    int height;

    AVLNode(Donor d) : donor(d), left(nullptr), right(nullptr), height(1) {}
};

class AVLTree {
private:
    AVLNode* root;

    int height(AVLNode* n) { return n ? n->height : 0; }
    int getBalance(AVLNode* n) { return n ? height(n->left) - height(n->right) : 0; }

    AVLNode* rightRotate(AVLNode* y) {
        AVLNode* x = y->left;
        AVLNode* T2 = x->right;
        x->right = y;
        y->left = T2;
        y->height = std::max(height(y->left), height(y->right)) + 1;
        x->height = std::max(height(x->left), height(x->right)) + 1;
        return x;
    }

    AVLNode* leftRotate(AVLNode* x) {
        AVLNode* y = x->right;
        AVLNode* T2 = y->left;
        y->left = x;
        x->right = T2;
        x->height = std::max(height(x->left), height(x->right)) + 1;
        y->height = std::max(height(y->left), height(y->right)) + 1;
        return y;
    }

    AVLNode* insertNode(AVLNode* node, Donor d) {
        if (!node) return new AVLNode(d);
        if (d.id < node->donor.id)
            node->left = insertNode(node->left, d);
        else if (d.id > node->donor.id)
            node->right = insertNode(node->right, d);
        else return node;

        node->height = 1 + std::max(height(node->left), height(node->right));
        int balance = getBalance(node);

        if (balance > 1 && d.id < node->left->donor.id) return rightRotate(node);
        if (balance < -1 && d.id > node->right->donor.id) return leftRotate(node);
        if (balance > 1 && d.id > node->left->donor.id) {
            node->left = leftRotate(node->left);
            return rightRotate(node);
        }
        if (balance < -1 && d.id < node->right->donor.id) {
            node->right = rightRotate(node->right);
            return leftRotate(node);
        }
        return node;
    }

    AVLNode* searchNode(AVLNode* node, std::string id) {
        if (!node || node->donor.id == id) return node;
        if (id < node->donor.id) return searchNode(node->left, id);
        return searchNode(node->right, id);
    }

    // Inorder Traversal execution to gather records for filtering
    void collectInorder(AVLNode* node, std::vector<Donor>& list) {
        if (!node) return;
        collectInorder(node->left, list);
        list.push_back(node->donor);
        collectInorder(node->right, list);
    }

public:
    AVLTree() : root(nullptr) {}

    void insert(Donor d) { root = insertNode(root, d); }

    Donor search(std::string id) {
        AVLNode* res = searchNode(root, id);
        if (res) return res->donor;
        return {"", "", "", "", "", false};
    }

    // Dynamic filtering array generation (Crucial for Viva Safety)
    std::vector<Donor> filterDonors(std::string blood, std::string dist) {
        std::vector<Donor> allDonors;
        std::vector<Donor> filtered;
        collectInorder(root, allDonors);

        for (const auto& d : allDonors) {
            if ((blood == "ALL" || d.bloodGroup == blood) && (dist == "ALL" || d.district == dist)) {
                filtered.push_back(d);
            }
        }
        return filtered;
    }
};

#endif

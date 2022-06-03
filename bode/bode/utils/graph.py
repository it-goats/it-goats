from collections import defaultdict


class DisjointSets:
    POINTER_TO_ONESELF = -1

    def __init__(self, uuids):
        self.parents = dict.fromkeys(uuids, self.POINTER_TO_ONESELF)
        self.ranks = dict.fromkeys(uuids, 0)

    def find(self, x):
        if self.parents[x] == self.POINTER_TO_ONESELF:
            return x

        self.parents[x] = self.find(self.parents[x])
        return self.parents[x]

    def union(self, x, y):
        parents = self.parents
        ranks = self.ranks

        x_root = self.find(x)
        y_root = self.find(y)

        if ranks[x_root] > ranks[y_root]:
            parents[y_root] = x_root
        elif ranks[x_root] < ranks[y_root]:
            parents[x_root] = y_root
        elif x_root != y_root:
            parents[y_root] = x_root
            ranks[x_root] += 1


class Graph:
    def __init__(self):
        self.graph = defaultdict(list)

    def add_edge(self, u, v):
        if v not in self.graph[u]:
            self.graph[u].append(v)

    def union_subsets(self, uuids):
        self.disjoint_sets = DisjointSets(uuids)

        for u in self.graph:
            for v in self.graph[u]:
                self.disjoint_sets.union(u, v)

        return self.disjoint_sets.parents

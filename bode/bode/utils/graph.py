from collections import defaultdict


class FindUnion:
    POINTER_TO_ONSESELF = -1

    def __init__(self, uuids):
        self.parents = dict.fromkeys(uuids, self.POINTER_TO_ONSESELF)
        self.ranks = dict.fromkeys(uuids, 0)

    def find(self, x):
        if self.parents[x] == self.POINTER_TO_ONSESELF:
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
    def __init__(self, V):
        self.V = V
        self.graph = defaultdict(list)

    def add_edge(self, u, v):
        self.graph[u].append(v)

    def union_subsets(self, uuids):
        self.find_union = FindUnion(uuids)
        find, union = self.find_union.find, self.find_union.union

        for i in self.graph:
            for j in self.graph[i]:
                x = find(i)
                y = find(j)
                if x != y:
                    union(x, y)

        return self.find_union.parents

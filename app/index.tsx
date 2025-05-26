import FamilyNode from '@/components/FamilyNode';
import ReactFamilyTree from '@/components/familyTree';
import { nodes } from '@/hooks/nodes';
import 'expo-router/entry';
import React from 'react';
import { ScrollView } from 'react-native';
export default function Index() {
  const WIDTH = 100;
  const HEIGHT = 100;

  return (
    <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
        <ReactFamilyTree
          nodes={nodes}
          rootId={nodes[0].id}
          width={WIDTH}
          height={HEIGHT}
          renderNode={(node) => (
              <FamilyNode
                key={node.id}
                node={node}
              />
          )}
        />
      </ScrollView>
    </ScrollView>
  );
}

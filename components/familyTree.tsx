import { X } from '@/constants/consts';
import React from 'react';
import { View } from 'react-native';
import calcTree from 'relatives-tree';
import { ExtNode, Node } from 'relatives-tree/lib/types';
import ContinuousConnector from './continuousConnector';

interface Props {
  nodes: ReadonlyArray<Node>;
  rootId: string;
  width: number;
  height: number;
  placeholders?: boolean;
  className?: string;
  renderNode: (node: ExtNode) => React.ReactNode;
}

export default React.memo<Props>(function ReactFamilyTree(props) {
  const data = calcTree(props.nodes, {
    rootId: props.rootId,
    placeholders: props.placeholders,
  });

  return (
    <View
      className={props.className}
      style={{
        position: 'relative',
        width: data.canvas.width * X,
        height: data.canvas.height * X,
        marginTop: 200
      }}
    >
      {/* {data.connectors.map((connector, idx) => (
        <Connector
          key={idx}
          connector={connector}
          index={idx} // Optional prop to indicate if this is the first connector
        />
      ))} */}
      <ContinuousConnector connectors={[...data.connectors]}/>
      {data.nodes.map(props.renderNode)}
    </View>
  );
});
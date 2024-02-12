import reconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import { $ } from "./consts";
import { clone, stateFiller } from "./iterator";

type SInfo = {
  filler?: (val: any) => void;
  total?: number;
  filled?: number;
};

type RehooxType = "node";
type RehooxProps = { children: any[]; state: any };
type RehooxContainer = {
  setState(newState: any): void;
  state: any;
};
type RehooxInstance = { [$]?: SInfo };
type RehooxTextInstance = null;
type RehooxSuspenseInstance = any;
type RehooxHydrableInstance = any;
type RehooxPublicInstance = any;
type RehooxHostContext = {};
type RehooxUpdatePayload = any;
type RehooxChildSet = { newState?: any };

function createInstanceFromProps(props: RehooxProps) {
  const result = clone(props.state);

  result[$] = {
    filler: stateFiller(result),
    total: props.children.length,
    filled: 0,
  };

  return result;
}

const rehooxReconciler = reconciler<
  RehooxType,
  RehooxProps,
  RehooxContainer,
  RehooxInstance,
  RehooxTextInstance,
  RehooxSuspenseInstance,
  RehooxHydrableInstance,
  RehooxPublicInstance,
  RehooxHostContext,
  RehooxUpdatePayload,
  RehooxChildSet,
  number /* TimeoutHandle */,
  -1 /* NoTimeout */
>({
  isPrimaryRenderer: true,
  supportsHydration: false,
  supportsMutation: false,
  supportsPersistence: true,
  supportsMicrotasks: true,

  scheduleTimeout: globalThis.setTimeout,
  cancelTimeout: globalThis.clearTimeout,
  scheduleMicrotask: globalThis.queueMicrotask,
  noTimeout: -1,

  getCurrentEventPriority: () => DefaultEventPriority,
  getInstanceFromNode: () => null,
  beforeActiveInstanceBlur() {},
  afterActiveInstanceBlur() {},
  prepareScopeUpdate() {},
  getInstanceFromScope: () => null,
  detachDeletedInstance() {},

  // -------------------
  //    Core Methods
  // -------------------

  createInstance(type, props, rootContainer, hostContext, internalHandle) {
    return createInstanceFromProps(props);
  },

  createTextInstance(text, rootContainer, hostContext, internalHandle) {
    return null;
  },

  appendInitialChild(parentInstance, child) {
    if (parentInstance[$]) {
      // console.info(child);
      parentInstance[$].filler?.(child);
      parentInstance[$].filled = (parentInstance[$].filled ?? 0) + 1;
      if (parentInstance[$].filled === parentInstance[$].total) {
        delete parentInstance[$];
      }
    }
  },

  finalizeInitialChildren: (
    instance,
    type,
    props,
    rootContainer,
    hostContext
  ) => {
    if (instance[$] && instance[$].filled === instance[$].total) {
      delete instance[$];
    }
    return false;
  },

  prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainer,
    hostContext
  ) {
    return true;
  },

  shouldSetTextContent: (type, props) => false,

  getRootHostContext: (rootContainer) => ({}),

  getChildHostContext: (parentHostContext, type, rootContainer) =>
    parentHostContext,

  getPublicInstance: (instance) => {
    return instance;
  },

  prepareForCommit: (containerInfo) => null,

  resetAfterCommit(containerInfo) {},

  preparePortalMount(containerInfo) {},

  // -------------------
  // Persistence Methods
  // -------------------

  cloneInstance(
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    internalInstanceHandle,
    keepChildren,
    recyclableInstance
  ) {
    return createInstanceFromProps(newProps);
  },
  createContainerChildSet(container) {
    return {};
  },
  appendChildToContainerChildSet(childSet, child) {
    childSet.newState = child;
  },
  finalizeContainerChildren(container, newChildren) {},
  replaceContainerChildren(container, newChildren) {
    container.setState(newChildren.newState);
  },
  cloneHiddenInstance(instance, type, props, internalInstanceHandle) {
    return instance;
  },
  cloneHiddenTextInstance(instance, text, internalInstanceHandle) {
    return null;
  },
});

rehooxReconciler.injectIntoDevTools({
  bundleType: 1,
  version: "0.0.1",
  rendererPackageName: "react-rehoox",
});

export default rehooxReconciler;

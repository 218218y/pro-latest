// Backward-compatible build dedupe facade.
//
// The canonical implementation lives in build_input_fingerprint.ts so the codebase
// has one explicit name for “all build-affecting input changed”. Public legacy
// exports stay here because scheduler/build-runner contracts still import them.

import type { BuildStateLike } from '../../../types/index.js';

import {
  createBuildInputFingerprint,
  normalizeBuildInputFingerprintScalar,
  readBuildInputFingerprintFromArgs,
  readBuildInputFingerprintFromState,
  readTransientBuildUiFlag,
  type BuildInputFingerprintReader,
  type BuildInputFingerprintParts,
} from './build_input_fingerprint.js';

export type BuildDedupeSignatureReader = BuildInputFingerprintReader;
export type BuildDedupeParts = BuildInputFingerprintParts;

export { readTransientBuildUiFlag };

export function normalizeBuildDedupeScalar(value: unknown): string {
  return normalizeBuildInputFingerprintScalar(value);
}

export function createBuildDedupeSignature(parts: BuildDedupeParts): unknown {
  return createBuildInputFingerprint(parts);
}

export function readBuildDedupeSignatureFromState(
  state: BuildStateLike | null | undefined,
  readSignature: BuildDedupeSignatureReader
): unknown {
  return readBuildInputFingerprintFromState(state, readSignature);
}

export function readBuildDedupeSignatureFromArgs(
  args: readonly unknown[],
  readSignature: BuildDedupeSignatureReader
): unknown {
  return readBuildInputFingerprintFromArgs(args, readSignature);
}

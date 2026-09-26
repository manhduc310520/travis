import { FC_TOKENS, type FcTokenName } from '../tokens.meta'

/** Every token whose name starts with one of the prefixes, in Figma order (numeric-aware). */
export const tokensWithPrefix = (...prefixes: string[]): FcTokenName[] =>
  FC_TOKENS.filter((t) => prefixes.some((p) => t.name.startsWith(p))).map((t) => t.name)

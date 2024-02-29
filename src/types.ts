export interface ErrnoException extends Error {
   errno?: number | undefined;
   code?: string | undefined;
   path?: string | undefined;
   syscall?: string | undefined;
}

export type ArbitraryObject = { [key: string]: unknown; };

type Opaque<T, K extends string> = T & { __typename: K }

type Base64 = Opaque<string, "base64">

export type Paper = Record<string, {
  name: string;
  createdAt: number;
  content:  Base64;
}>

export type Mode = 'list' | 'read';

export type PaperToRead = {
  content: string;
  name: string;
};

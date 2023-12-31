export type LoadingModel<T> =
    | { data: T; loading: false; error: undefined }
    | { data: undefined; loading: true; error: undefined }
    | { data: undefined; loading: false; error: Error };

export type TeaserFieldValue =
    | {
          contentTypes: { [uid: string]: number[] };
      }
    | null
    | undefined;

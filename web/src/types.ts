export type ActivityType = 'commit'|'pr';
export interface Activity { id:string; type:ActivityType; title:string; message?:string; url:string; author:string; committedAt:string }
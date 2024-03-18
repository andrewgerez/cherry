import postgres from 'postgres'

export const sql = postgres('postgesql://docker:docker@localhost:5432/cherry_links')

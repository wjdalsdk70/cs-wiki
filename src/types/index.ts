export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  created_at: string
}

export type Article = {
  id: string
  title: string
  slug: string
  content: string
  summary: string | null
  category_id: string
  tags: string[]
  is_published: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export type ArticleWithCategory = Article & {
  category: Category
}

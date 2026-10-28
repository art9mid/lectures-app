import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '@/lib/shared';
import { AUTH_COOKIE, isAuthed } from '@/lib/auth';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

// Reachable without logging in: the login page itself and build assets.
const PUBLIC = /^\/(login|_next\/|favicon\.ico|icon|apple-icon)/;

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!PUBLIC.test(path) && !isAuthed(request.cookies.get(AUTH_COOKIE)?.value)) {
    if (path.startsWith('/api/')) return new NextResponse('Unauthorized', { status: 401 });
    const login = new URL('/login', request.url);
    login.searchParams.set('next', path + request.nextUrl.search);
    return NextResponse.redirect(login);
  }

  const result = rewriteSuffix(path);
  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(request.nextUrl.pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl), {
        // this URL has two representations, selected by `Accept`
        headers: { Vary: 'Accept' },
      });
    }
  }

  return NextResponse.next();
}

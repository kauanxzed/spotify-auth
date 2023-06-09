import { redirectToAuthCodeFlow, getAccessToken } from "./functions"

const clientId = ''
const params = new URLSearchParams(window.location.search);
const code = params.get("code")

if (!code) {
  redirectToAuthCodeFlow(clientId)
} else {
  const accessToken = await getAccessToken(clientId, code)
  const profile = await fetchProfile(accessToken)
  populateUI(profile)
}

async function fetchProfile(token: string): Promise<any> {
  const result = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
  return await result.json()
}

function query(selector: string) {
  return document.querySelector<HTMLElement>(selector)!
}
function populateUI(profile: any) {
  query('#displayName').innerText = profile.display_name
  if (profile.images[0]) {
    const profileImage = new Image(200, 200)
    profileImage.src = profile.images[0].url
    query('#avatar').appendChild(profileImage)
  }
  query('#id').innerText = profile.id
  query('#email').innerText = profile.email
  query('#uri').innerText = profile.uri
  query('#uri').setAttribute('href',
    profile.external_urls.spotify)
  query('#url').innerText = profile.href
  query('#url').setAttribute('href', profile.href)
  query('#imgUrl').innerText = profile.images[0]?.url ?? 'Sem imagem de perfil'
}

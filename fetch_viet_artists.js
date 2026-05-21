const fs = require('fs');

const searchTerms = [
  'V-Pop',
  'Rap Việt',
  'Nhạc Việt',
  'Nhạc Trẻ',
  'Trịnh Công Sơn',
  'Sơn Tùng M-TP',
  'Đen Vâu',
  'Mỹ Tâm',
  'Hoàng Thùy Linh',
  'Vũ.',
  'Tlinh',
  'MCK',
  'GREY D',
  'Low G',
  'Đàm Vĩnh Hưng',
  'Lệ Quyên',
  'Erik',
  'Đức Phúc',
  'Hòa Minzy',
  'Trúc Nhân',
  'Bích Phương',
  'Soobin Hoàng Sơn',
  'Phan Mạnh Quỳnh',
  'Min',
  'JustaTee',
  'Suboi',
  'Karik',
  'Binz',
  'Rhymastic'
];

async function fetchArtists() {
  console.log('Bắt đầu tải danh sách nghệ sĩ Việt từ iTunes API...');
  const artistMap = new Map();

  for (const term of searchTerms) {
    try {
      console.log(`Đang tìm kiếm với từ khóa: "${term}"...`);
      // Đầu tiên tìm kiếm theo thực thể musicArtist
      const artistUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=musicArtist&limit=20&country=VN`;
      const artistRes = await fetch(artistUrl);
      if (artistRes.ok) {
        const data = await artistRes.json();
        if (data.results) {
          for (const item of data.results) {
            if (item.artistName && item.artistId) {
              const id = String(item.artistId);
              artistMap.set(id, {
                id: id,
                name: item.artistName,
                genre: item.primaryGenreName || 'V-Pop',
                artistLinkUrl: item.artistLinkUrl || ''
              });
            }
          }
        }
      }

      // Tìm kiếm thêm theo song để có thêm nghệ sĩ và ảnh đại diện
      const songUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=30&country=VN`;
      const songRes = await fetch(songUrl);
      if (songRes.ok) {
        const data = await songRes.json();
        if (data.results) {
          for (const item of data.results) {
            if (item.artistName && item.artistId) {
              const id = String(item.artistId);
              const artworkUrl = item.artworkUrl100 ? item.artworkUrl100.replace('100x100', '600x600') : '';
              if (artistMap.has(id)) {
                const existing = artistMap.get(id);
                if (!existing.image && artworkUrl) {
                  existing.image = artworkUrl;
                }
              } else {
                artistMap.set(id, {
                  id: id,
                  name: item.artistName,
                  genre: item.primaryGenreName || 'V-Pop',
                  image: artworkUrl,
                  artistLinkUrl: ''
                });
              }
            }
          }
        }
      }

      // Đợi một chút để tránh bị rate limit
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Lỗi khi tìm kiếm từ khóa "${term}":`, error.message);
    }
  }

  // Chuyển map thành array và lọc các nghệ sĩ có tên tiếng Việt hoặc thuộc thị trường Việt
  const artists = Array.from(artistMap.values());
  
  // Trộn ngẫu nhiên
  const shuffledArtists = artists.sort(() => Math.random() - 0.5);

  const outputPath = 'vietnamese_artists.json';
  fs.writeFileSync(outputPath, JSON.stringify(shuffledArtists, null, 2), 'utf-8');
  console.log(`\nĐã tải thành công ${shuffledArtists.length} nghệ sĩ!`);
  console.log(`Kết quả được ghi nhận tại file: ${outputPath}`);

  // Hiển thị thử 15 nghệ sĩ ngẫu nhiên
  console.log('\n--- 15 Nghệ sĩ ngẫu nhiên tiêu biểu ---');
  shuffledArtists.slice(0, 15).forEach((artist, index) => {
    console.log(`${index + 1}. ${artist.name} (${artist.genre}) - ID: ${artist.id}`);
  });
}

fetchArtists();

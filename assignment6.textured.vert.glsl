#version 300 es

// an attribute will receive data from a buffer
in vec3 a_position;
in vec3 a_normal;
in vec3 a_tangent;
in vec2 a_texture_coord;

// transformation matrices
uniform mat4x4 u_m;
uniform mat4x4 u_v;
uniform mat4x4 u_p;

// output to fragment stage
out vec3 o_vertex_position_world;
out mat3 tbn;
out vec2 tex_coords;

void main() {

    // transform a vertex from object space directly to screen space
    // the full chain of transformations is:
    // object space -{model}-> world space -{view}-> view space -{projection}-> clip space
	
    vec4 vertex_position_world = u_m * vec4(a_position, 1.0);
    o_vertex_position_world = vertex_position_world.xyz;
    gl_Position = u_p * u_v * vertex_position_world;

    tex_coords = a_texture_coord;

    // construct TBN matrix from normals, tangents and bitangents
    vec3 T = normalize(u_m * vec4(a_tangent, 0.0)).xyz;
    vec3 N = normalize(u_m * vec4(a_normal, 0.0)).xyz;
    T = normalize(T - dot(T, N) * N);
    vec3 B = cross(N, T);
    tbn = transpose(mat3(T, B, N));
}